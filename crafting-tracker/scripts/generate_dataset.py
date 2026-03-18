from __future__ import annotations

import argparse
import configparser
import json
import re
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
import xml.etree.ElementTree as ET


ROOT_DIR = Path(__file__).resolve().parents[1]
DEFAULT_DATA_ROOT = ROOT_DIR.parent.parent / "StarCitizenData" / "raw" / "Data"
ENGLISH_LOC_PATH = Path("Localization/english/global.ini")
BLUEPRINTS_ROOT = Path("Libs/Foundry/Records/crafting/blueprints/crafting")
MISSION_POOLS_ROOT = Path("Libs/Foundry/Records/crafting/blueprintrewards/blueprintmissionpools")
CRAFTED_PROPERTIES_ROOT = Path("Libs/Foundry/Records/crafting/craftedproperties")
ENTITIES_ROOT = Path("Libs/Foundry/Records/entities")
AMMO_PARAMS_ROOT = Path("Libs/Foundry/Records/ammoparams")
CONTRACT_GENERATORS_ROOT = Path("Libs/Foundry/Records/contracts/contractgenerator")
CONTRACT_TEMPLATES_ROOT = Path("Libs/Foundry/Records/contracts/contracttemplates")
MISSION_TYPE_ROOT = Path("Libs/Foundry/Records/missiontype")
DAMAGE_ROOT = Path("Libs/Foundry/Records/damage")
OUTPUT_PATH = ROOT_DIR / "src" / "data" / "generated.ts"


def local_name(tag: str) -> str:
    return tag.split("}", 1)[-1]


def to_title_case(value: str) -> str:
    parts = [part for part in re.split(r"[_\-\s]+", value) if part]
    formatted: list[str] = []
    acronyms = {"smg", "lmg", "fps", "rsi", "ksar", "behr", "gmni", "klwe", "lbco", "volt", "grin", "hdtg", "doom", "ccc", "cds"}
    for part in parts:
        lowered = part.lower()
        if lowered in acronyms:
            formatted.append(part.upper())
        elif re.fullmatch(r"\d+", part):
            formatted.append(part)
        else:
            formatted.append(part.capitalize())
    return " ".join(formatted)


def format_craft_time(total_seconds: int) -> str:
    minutes, seconds = divmod(total_seconds, 60)
    hours, minutes = divmod(minutes, 60)
    parts: list[str] = []
    if hours:
        parts.append(f"{hours}h")
    if minutes:
        parts.append(f"{minutes}m")
    if seconds or not parts:
        parts.append(f"{seconds}s")
    return " ".join(parts)


def format_number(value: float) -> str:
    if value.is_integer():
        return str(int(value))
    return f"{value:.3f}".rstrip("0").rstrip(".")


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")


def resolve_loc(loc: dict[str, str], raw_value: str | None) -> str:
    if not raw_value:
        return ""
    key = raw_value.lstrip("@")
    return loc.get(key) or loc.get(f"{key},P") or key


def read_english_loc(data_root: Path) -> dict[str, str]:
    loc_path = data_root / ENGLISH_LOC_PATH
    parser = configparser.RawConfigParser(strict=False)
    parser.optionxform = str
    with loc_path.open("r", encoding="utf-8", errors="ignore") as handle:
        content = "[loc]\n" + handle.read()
    parser.read_string(content)
    return dict(parser["loc"])


@dataclass
class EntityInfo:
    ref: str
    name: str
    path: str
    record_path: str
    localization_key: str
    input_type: str | None
    inventory_scu: float | None


@dataclass
class DamageInfo:
    physical_multiplier: float | None
    impact_force_resistance: float | None
    record_path: str


@dataclass
class AmmoParamsInfo:
    speed: float | None
    damage: float | None
    record_path: str


def to_record_path(path: Path, data_root: Path) -> str:
    try:
        return str(path.relative_to(data_root)).replace("\\", "/")
    except ValueError:
        return str(path).replace("\\", "/")


def classify_entity_input_type(root: ET.Element, entity_file: Path) -> str | None:
    for node in root.iter():
        if local_name(node.tag) != "CommodityComponentParams":
            continue
        is_unrefined = node.attrib.get("IsUnrefinedElement")
        if is_unrefined == "1":
            return "Raw"
        if is_unrefined == "0":
            return "Refined"

    root_tag = local_name(root.tag).lower()
    path_text = str(entity_file).lower()
    if "harvestable_" in root_tag or "harvestable_" in path_text:
        return "Raw"

    for node in root.iter():
        if local_name(node.tag) != "AttachDef":
            continue
        if node.attrib.get("SubType", "").lower() == "harvestable":
            return "Raw"

    return None


def cargo_units_to_scu(node: ET.Element) -> float | None:
    if "standardCargoUnits" in node.attrib:
        return float(node.attrib.get("standardCargoUnits", "0"))
    if "centiSCU" in node.attrib:
        return float(node.attrib.get("centiSCU", "0")) / 100
    if "microSCU" in node.attrib:
        return float(node.attrib.get("microSCU", "0")) / 1_000_000
    return None


def extract_inventory_volume_scu(root: ET.Element) -> float | None:
    inventory_volume = first_matching_node(root, "inventoryOccupancyVolume")
    if inventory_volume is not None:
        for node in inventory_volume.iter():
            volume_scu = cargo_units_to_scu(node)
            if volume_scu is not None:
                return volume_scu

    resource_container = first_matching_node(root, "ResourceContainer")
    if resource_container is not None:
        capacity = first_matching_node(resource_container, "capacity")
        if capacity is not None:
            for node in capacity.iter():
                volume_scu = cargo_units_to_scu(node)
                if volume_scu is not None:
                    return volume_scu

    return None


def build_entity_indexes(data_root: Path, loc: dict[str, str]) -> tuple[dict[str, EntityInfo], dict[str, str]]:
    entity_by_ref: dict[str, EntityInfo] = {}
    resource_name_by_ref: dict[str, str] = {}

    for entity_file in (data_root / ENTITIES_ROOT).rglob("*.xml"):
        try:
            tree = ET.parse(entity_file)
        except ET.ParseError:
            continue

        root = tree.getroot()
        root_ref = root.attrib.get("__ref")
        if not root_ref:
            continue

        input_type = classify_entity_input_type(root, entity_file)
        inventory_scu = extract_inventory_volume_scu(root)

        localization_key = ""
        name = ""
        for localization in root.iter():
            if local_name(localization.tag) == "Localization":
                localization_key = localization.attrib.get("Name", "")
                name = resolve_loc(loc, localization_key)
                if name:
                    break

        if name:
            entity_by_ref[root_ref] = EntityInfo(
                ref=root_ref,
                name=name,
                path=str(entity_file),
                record_path=to_record_path(entity_file, data_root),
                localization_key=localization_key,
                input_type=input_type,
                inventory_scu=inventory_scu,
            )

        for entry in root.iter():
            if local_name(entry.tag) == "ResourceContainerDefaultCompositionEntry":
                resource_ref = entry.attrib.get("entry")
                if resource_ref and name and resource_ref not in resource_name_by_ref:
                    resource_name_by_ref[resource_ref] = name

    return entity_by_ref, resource_name_by_ref


def build_property_map(data_root: Path, loc: dict[str, str]) -> dict[str, dict[str, str]]:
    property_map: dict[str, dict[str, str]] = {}
    for property_file in (data_root / CRAFTED_PROPERTIES_ROOT).glob("*.xml"):
        try:
            tree = ET.parse(property_file)
        except ET.ParseError:
            continue
        root = tree.getroot()
        ref = root.attrib.get("__ref")
        if not ref:
            continue
        property_map[ref] = {
            "name": resolve_loc(loc, root.attrib.get("propertyName")),
            "canonicalName": canonical_property_name(property_file.stem),
            "unit": resolve_loc(loc, root.attrib.get("unitFormat")),
            "unitLabel": unit_label_from_format(resolve_loc(loc, root.attrib.get("unitFormat"))),
            "precision": str(precision_from_format(resolve_loc(loc, root.attrib.get("unitFormat")))),
            "sourceRecordPath": to_record_path(property_file, data_root),
        }
    return property_map


def canonical_property_name(stem: str) -> str:
    aliases = {
        "gpp_weapon_damage": "Damage",
        "gpp_weapon_firerate": "Fire Rate",
        "gpp_weapon_spread": "Spread",
        "gpp_weapon_recoil_handling": "Recoil Handling",
        "gpp_weapon_recoil_kick": "Recoil Kick",
        "gpp_weapon_recoil_smoothness": "Recoil Smoothness",
        "gpp_armor_damagemitigation": "Damage Mitigation",
        "gpp_armor_temperaturemin": "Min Temp",
        "gpp_armor_temperaturemax": "Max Temp",
        "gpp_armor_radiationcapacity": "Radiation Capacity",
        "gpp_armor_radiationdissipation": "Radiation Dissipation",
    }
    return aliases.get(stem, to_title_case(stem.removeprefix("gpp_")))


def unit_label_from_format(unit_format: str) -> str:
    if "RPM" in unit_format:
        return "RPM"
    if "mRem/s" in unit_format:
        return "mRem/s"
    if "mRem" in unit_format:
        return "mRem"
    if "ºC" in unit_format or "°C" in unit_format:
        return "°C"
    if "%" in unit_format:
        return "%"
    return ""


def precision_from_format(unit_format: str) -> int:
    match = re.search(r"%\+?\.(\d+)f|%\.(\d+)f", unit_format)
    if match:
        for group in match.groups():
            if group is not None:
                return int(group)
    return 2


def higher_is_better(stat: str) -> bool:
    lower_is_better = {
        "Min Temp",
        "Spread",
        "Spread Min",
        "Spread Max",
        "Recoil Handling",
        "Recoil Kick",
        "Recoil Smoothness",
    }
    return stat not in lower_is_better


def build_damage_map(data_root: Path) -> dict[str, DamageInfo]:
    damage_by_ref: dict[str, DamageInfo] = {}
    for damage_file in (data_root / DAMAGE_ROOT).glob("*.xml"):
        try:
            tree = ET.parse(damage_file)
        except ET.ParseError:
            continue

        root = tree.getroot()
        damage_ref = root.attrib.get("__ref")
        if not damage_ref:
            continue

        physical_multiplier = None
        impact_force_resistance = None
        for node in root.iter():
            node_name = local_name(node.tag)
            if node_name == "PhysicalResistance":
                physical_multiplier = float(node.attrib.get("Multiplier", "0"))
            elif node_name == "impactForceResistance":
                impact_force_resistance = float(node.attrib.get("impactForceResistance", "0"))

        damage_by_ref[damage_ref] = DamageInfo(
            physical_multiplier=physical_multiplier,
            impact_force_resistance=impact_force_resistance,
            record_path=to_record_path(damage_file, data_root),
        )

    return damage_by_ref


def build_ammo_params_map(data_root: Path) -> dict[str, AmmoParamsInfo]:
    ammo_by_ref: dict[str, AmmoParamsInfo] = {}
    for ammo_file in (data_root / AMMO_PARAMS_ROOT).rglob("*.xml"):
        try:
            tree = ET.parse(ammo_file)
        except ET.ParseError:
            continue

        root = tree.getroot()
        ammo_ref = root.attrib.get("__ref")
        if not ammo_ref:
            continue

        speed = float(root.attrib.get("speed", "0")) if root.attrib.get("speed") else None
        damage = None
        for node in root.iter():
            if local_name(node.tag) == "DamageInfo":
                damage_keys = [key for key in node.attrib if key.startswith("Damage")]
                if damage_keys:
                    damage = sum(float(node.attrib.get(key, "0")) for key in damage_keys)
                break

        ammo_by_ref[ammo_ref] = AmmoParamsInfo(
            speed=speed,
            damage=damage,
            record_path=to_record_path(ammo_file, data_root),
        )

    return ammo_by_ref


def build_mission_type_map(data_root: Path, loc: dict[str, str]) -> dict[str, str]:
    mission_type_by_ref: dict[str, str] = {}
    for mission_type_file in (data_root / MISSION_TYPE_ROOT).rglob("*.xml"):
        try:
            tree = ET.parse(mission_type_file)
        except ET.ParseError:
            continue

        root = tree.getroot()
        mission_type_ref = root.attrib.get("__ref")
        if not mission_type_ref:
            continue

        localized_name = resolve_loc(loc, root.attrib.get("LocalisedTypeName"))
        fallback_name = to_title_case(mission_type_file.stem.replace("missiontype.", ""))
        mission_type_by_ref[mission_type_ref] = localized_name or fallback_name or "Unknown"

    return mission_type_by_ref


def build_contract_template_type_map(data_root: Path, mission_type_by_ref: dict[str, str]) -> dict[str, str]:
    template_type_by_ref: dict[str, str] = {}
    for template_file in (data_root / CONTRACT_TEMPLATES_ROOT).rglob("*.xml"):
        try:
            tree = ET.parse(template_file)
        except ET.ParseError:
            continue

        root = tree.getroot()
        template_ref = root.attrib.get("__ref")
        if not template_ref:
            continue

        mission_type_ref = ""
        for node in root.iter():
            if local_name(node.tag) == "ContractDisplayInfo":
                mission_type_ref = node.attrib.get("type", "")
                break

        template_type_by_ref[template_ref] = mission_type_by_ref.get(mission_type_ref, "Unknown") if mission_type_ref else "Unknown"

    return template_type_by_ref


def humanize_pool_stem(stem: str) -> str:
    stem = stem.removeprefix("bp_missionreward_")
    replacements = {
        "fps": "FPS",
        "bhg": "BHG",
        "rdc": "RDC",
        "asd": "ASD",
        "ids": "IDS",
        "cfp": "CFP",
        "ab": "AB",
        "cd": "CD",
        "pyronyx": "Pyro Nyx",
    }
    parts = stem.split("_")
    output: list[str] = []
    for part in parts:
        lowered = part.lower()
        output.append(replacements.get(lowered, to_title_case(part)))
    return " / ".join(output)


def humanize_debug_token(token: str) -> str:
    if not token:
        return ""

    parts = [part for part in token.split("-") if part]
    formatted_parts: list[str] = []
    acronyms = {"ab", "asd", "bhg", "cd", "cfp", "fps", "hh", "ids", "rdc", "ve", "xt"}

    for part in parts:
        match = re.fullmatch(r"Region([A-Za-z0-9]+)", part)
        if match:
            formatted_parts.append(f"Region {match.group(1).upper()}")
            continue

        match = re.fullmatch(r"Rank(\d+)", part, re.IGNORECASE)
        if match:
            formatted_parts.append(f"Rank {match.group(1)}")
            continue

        match = re.fullmatch(r"Stanton(\d+)", part, re.IGNORECASE)
        if match:
            formatted_parts.append(f"Stanton {match.group(1)}")
            continue

        match = re.fullmatch(r"(\d+)Box", part, re.IGNORECASE)
        if match:
            formatted_parts.append(f"{match.group(1)} Box")
            continue

        expanded = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", part)
        expanded = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", expanded)
        words = []
        for word in expanded.split():
            lowered = word.lower()
            if lowered in acronyms:
                words.append(lowered.upper())
            elif re.fullmatch(r"\d+", word):
                words.append(word)
            else:
                words.append(word.capitalize())
        formatted_parts.append(" ".join(words))

    return " / ".join(formatted_parts)


def parse_contract_debug_fields(debug_name: str) -> dict[str, Any]:
    if not debug_name:
        return {"system": "", "region": "", "locations": [], "objective": ""}

    tokens = [token for token in debug_name.split("_") if token]
    if len(tokens) > 1:
        tokens = tokens[1:]

    objective_map = {
        "bombingrun": "Bombing Run",
        "eliminateboss": "Eliminate Boss",
        "eliminatespecific": "Eliminate Specific Target",
        "recoveritem": "Recover Item",
        "sabotage": "Sabotage",
    }

    system = ""
    region = ""
    locations: list[str] = []
    objective = ""

    for token in tokens:
        lowered = token.lower()

        if lowered in {"pyro", "nyx"}:
            system = humanize_debug_token(token)
            continue

        if re.fullmatch(r"stanton\d+", lowered):
            system = humanize_debug_token(token)
            continue

        if re.fullmatch(r"region[a-z0-9]+", lowered):
            region = lowered.removeprefix("region").upper()
            continue

        if lowered == "repeat" or re.fullmatch(r"rank\d+", lowered):
            continue

        if lowered in objective_map:
            objective = objective_map[lowered]
            continue

        humanized = humanize_debug_token(token)
        if humanized:
            locations.append(humanized)

    return {
        "system": system,
        "region": region,
        "locations": list(dict.fromkeys(locations)),
        "objective": objective,
    }


def normalize_mission_location(debug_fields: dict[str, Any]) -> str:
    system = debug_fields.get("system", "")
    region = debug_fields.get("region", "")
    locations = [location for location in debug_fields.get("locations", []) if location]

    parts: list[str] = []
    if system:
        parts.append(system)
    if region:
        parts.append(f"Region {region}")
    if not parts and locations:
        parts.append(locations[0])
    return " / ".join(parts) if parts else "Unknown"


def normalize_mission_title(title: str, debug_name: str, file_context: str) -> str:
    cleaned = title.strip()
    if cleaned and cleaned not in {"<= UNINITIALIZED =>", "UNINITIALIZED"}:
        return cleaned
    fallback = to_title_case(debug_name)
    return fallback or file_context or "Unknown"


def build_mission_pool_map(
    data_root: Path,
    loc: dict[str, str],
    mission_type_by_ref: dict[str, str],
) -> dict[str, list[dict[str, str]]]:
    contract_template_type_by_ref = build_contract_template_type_map(data_root, mission_type_by_ref)
    mission_contracts_by_pool = build_contract_source_map(data_root, loc, mission_type_by_ref, contract_template_type_by_ref)
    mission_pool_map: dict[str, list[dict[str, str]]] = defaultdict(list)
    for pool_file in (data_root / MISSION_POOLS_ROOT).glob("*.xml"):
        try:
            tree = ET.parse(pool_file)
        except ET.ParseError:
            continue

        pool_ref = tree.getroot().attrib.get("__ref", "")
        mission_name = humanize_pool_stem(pool_file.stem)
        for reward in tree.getroot().iter():
            if local_name(reward.tag) != "BlueprintReward":
                continue
            blueprint_record = reward.attrib.get("blueprintRecord")
            if not blueprint_record or blueprint_record == "00000000-0000-0000-0000-000000000000":
                continue
            if pool_ref and pool_ref in mission_contracts_by_pool:
                mission_pool_map[blueprint_record].extend(mission_contracts_by_pool[pool_ref])
            else:
                mission_pool_map[blueprint_record].append(
                    {
                        "kind": "mission-pool",
                        "missionName": mission_name,
                        "missionGiver": "Unknown",
                        "missionType": "Unknown",
                        "location": "Unknown",
                    }
                )
    return mission_pool_map


def build_contract_source_map(
    data_root: Path,
    loc: dict[str, str],
    mission_type_by_ref: dict[str, str],
    contract_template_type_by_ref: dict[str, str],
) -> dict[str, list[dict[str, str]]]:
    contract_source_map: dict[str, list[dict[str, str]]] = defaultdict(list)
    seen: dict[str, set[tuple[str, str, str, str, str]]] = defaultdict(set)
    zero_guid = "00000000-0000-0000-0000-000000000000"

    for contract_file in (data_root / CONTRACT_GENERATORS_ROOT).rglob("*.xml"):
        try:
            tree = ET.parse(contract_file)
        except ET.ParseError:
            continue

        root = tree.getroot()
        file_context = to_title_case(contract_file.stem)

        for handler in root.iter():
            if "ContractGeneratorHandler" not in local_name(handler.tag):
                continue

            handler_contractor_key = next(
                (
                    node.attrib.get("value", "")
                    for node in handler.iter()
                    if local_name(node.tag) == "ContractStringParam" and node.attrib.get("param") == "Contractor"
                ),
                "",
            )
            handler_contractor = resolve_loc(loc, handler_contractor_key) or to_title_case(handler.attrib.get("debugName", ""))
            handler_mission_type_ref = next(
                (
                    child.attrib.get("missionTypeOverride", "")
                    for child in handler
                    if child.attrib.get("missionTypeOverride") and child.attrib.get("missionTypeOverride") != zero_guid
                ),
                "",
            )

            for contract in handler.iter():
                if local_name(contract.tag) not in {"Contract", "CareerContract"}:
                    continue

                title_key = next(
                    (
                        node.attrib.get("value", "")
                        for node in contract.iter()
                        if local_name(node.tag) == "ContractStringParam" and node.attrib.get("param") == "Title"
                    ),
                    "",
                )
                contractor_key = next(
                    (
                        node.attrib.get("value", "")
                        for node in contract.iter()
                        if local_name(node.tag) == "ContractStringParam" and node.attrib.get("param") == "Contractor"
                    ),
                    "",
                )

                raw_title = resolve_loc(loc, title_key)
                title = normalize_mission_title(raw_title, contract.attrib.get("debugName", ""), file_context)
                contractor = resolve_loc(loc, contractor_key) or handler_contractor or file_context
                debug_name = contract.attrib.get("debugName", "")
                template_ref = contract.attrib.get("template", "")
                mission_type_ref = next(
                    (
                        child.attrib.get("missionTypeOverride", "")
                        for child in contract
                        if child.attrib.get("missionTypeOverride") and child.attrib.get("missionTypeOverride") != zero_guid
                    ),
                    handler_mission_type_ref,
                )
                mission_type = mission_type_by_ref.get(mission_type_ref, "Unknown")
                if mission_type == "Unknown" and template_ref:
                    mission_type = contract_template_type_by_ref.get(template_ref, "Unknown")

                for reward in contract.iter():
                    if local_name(reward.tag) != "BlueprintRewards":
                        continue
                    pool_ref = reward.attrib.get("blueprintPool", "")
                    if not pool_ref:
                        continue

                    debug_fields = parse_contract_debug_fields(debug_name)
                    entry = {
                        "kind": "mission",
                        "missionName": title,
                        "missionGiver": contractor or file_context or "Unknown",
                        "missionType": mission_type,
                        "location": normalize_mission_location(debug_fields),
                    }
                    key = (
                        entry["kind"],
                        entry["missionName"],
                        entry["missionGiver"],
                        entry["missionType"],
                        entry["location"],
                    )
                    if key in seen[pool_ref]:
                        continue
                    seen[pool_ref].add(key)
                    contract_source_map[pool_ref].append(entry)

    for pool_ref, entries in contract_source_map.items():
        entries.sort(key=lambda entry: (entry["missionName"], entry["missionGiver"], entry["missionType"], entry["location"]))

    return contract_source_map


def infer_category_parts(relative_parts: list[str]) -> dict[str, str | None]:
    if not relative_parts:
        return {
            "category": "Unknown",
            "subcategory": "Unknown",
            "armorClass": None,
            "armorSlot": None,
            "weaponClass": None,
        }

    root = relative_parts[0]
    if root == "fpsgear" and len(relative_parts) >= 2:
        branch = relative_parts[1]
        if branch == "armour":
            style = to_title_case(relative_parts[2]) if len(relative_parts) > 2 else "Armour"
            armor_class = to_title_case(relative_parts[3]) if len(relative_parts) > 3 else None
            armor_slot = to_title_case(relative_parts[4]) if len(relative_parts) > 4 else None
            return {
                "category": "Armour",
                "subcategory": style,
                "armorClass": armor_class,
                "armorSlot": armor_slot,
                "weaponClass": None,
            }
        if branch == "weapons":
            weapon_class = to_title_case(relative_parts[2]) if len(relative_parts) > 2 else None
            return {
                "category": "Weapons",
                "subcategory": weapon_class or "Weapons",
                "armorClass": None,
                "armorSlot": None,
                "weaponClass": weapon_class,
            }
        return {
            "category": to_title_case(branch),
            "subcategory": to_title_case(relative_parts[2]) if len(relative_parts) > 2 else to_title_case(branch),
            "armorClass": None,
            "armorSlot": None,
            "weaponClass": None,
        }

    category = to_title_case(root)
    subcategory = to_title_case(relative_parts[1]) if len(relative_parts) > 1 else category
    return {
        "category": category,
        "subcategory": subcategory,
        "armorClass": None,
        "armorSlot": None,
        "weaponClass": None,
    }


def first_matching_node(root: ET.Element, tag_name: str) -> ET.Element | None:
    return next((node for node in root.iter() if local_name(node.tag) == tag_name), None)


def extract_weapon_fire_rate(entity_root: ET.Element) -> float | None:
    for node in entity_root.iter():
        if local_name(node.tag).startswith("SWeaponActionFire") and "fireRate" in node.attrib:
            return float(node.attrib.get("fireRate", "0"))
    return None


def extract_entity_mass(entity_root: ET.Element) -> float | None:
    for node in entity_root.iter():
        if local_name(node.tag) == "SEntityRigidPhysicsControllerParams" and node.attrib.get("Mass"):
            return float(node.attrib.get("Mass", "0"))
    return None


def extract_armor_resistances(entity_root: ET.Element) -> tuple[float | None, float | None, float | None, float | None]:
    clothing_node = first_matching_node(entity_root, "SCItemClothingParams")
    min_temp = None
    max_temp = None
    radiation_capacity = None
    radiation_dissipation = None
    if clothing_node is not None:
        temperature_node = first_matching_node(clothing_node, "TemperatureResistance")
        if temperature_node is not None:
            min_temp = float(temperature_node.attrib.get("MinResistance", "0"))
            max_temp = float(temperature_node.attrib.get("MaxResistance", "0"))
        radiation_node = first_matching_node(clothing_node, "RadiationResistance")
        if radiation_node is not None:
            radiation_capacity = float(radiation_node.attrib.get("MaximumRadiationCapacity", "0"))
            radiation_dissipation = float(radiation_node.attrib.get("RadiationDissipationRate", "0"))
    return min_temp, max_temp, radiation_capacity, radiation_dissipation


def extract_damage_mitigation(entity_root: ET.Element, damage_by_ref: dict[str, DamageInfo]) -> tuple[float | None, str | None]:
    armor_node = first_matching_node(entity_root, "SCItemSuitArmorParams")
    if armor_node is None:
        return None, None

    damage_ref = armor_node.attrib.get("damageResistance", "")
    if not damage_ref:
        return None, None

    damage_info = damage_by_ref.get(damage_ref)
    if damage_info is None or damage_info.physical_multiplier is None:
        return None, None

    return 1 - damage_info.physical_multiplier, damage_info.record_path


def extract_weapon_component(entity_root: ET.Element) -> ET.Element | None:
    return first_matching_node(entity_root, "SCItemWeaponComponentParams")


def extract_weapon_spread(entity_root: ET.Element) -> tuple[float | None, float | None]:
    for node in entity_root.iter():
        if local_name(node.tag).startswith("SWeaponActionFire"):
            spread_node = first_matching_node(node, "spreadParams")
            if spread_node is not None:
                nested_spread = next((child for child in spread_node.iter() if local_name(child.tag) == "SSpreadParams"), None)
                if nested_spread is not None:
                    spread_node = nested_spread
                return (
                    float(spread_node.attrib.get("min", "0")) if spread_node.attrib.get("min") else None,
                    float(spread_node.attrib.get("max", "0")) if spread_node.attrib.get("max") else None,
                )
    return None, None


def extract_weapon_magazine_info(
    entity_root: ET.Element,
    entity_by_ref: dict[str, EntityInfo],
    ammo_by_ref: dict[str, AmmoParamsInfo],
) -> dict[str, Any]:
    weapon_component = extract_weapon_component(entity_root)
    if weapon_component is None:
        return {"magSize": None, "ammoSpeed": None, "damage": None, "ammoContainerPath": None, "ammoParamsPath": None}

    ammo_container_ref = weapon_component.attrib.get("ammoContainerRecord", "")
    if not ammo_container_ref:
        return {"magSize": None, "ammoSpeed": None, "damage": None, "ammoContainerPath": None, "ammoParamsPath": None}

    ammo_container = entity_by_ref.get(ammo_container_ref)
    if ammo_container is None:
        return {"magSize": None, "ammoSpeed": None, "damage": None, "ammoContainerPath": None, "ammoParamsPath": None}

    try:
        ammo_root = ET.parse(ammo_container.path).getroot()
    except ET.ParseError:
        return {"magSize": None, "ammoSpeed": None, "damage": None, "ammoContainerPath": ammo_container.record_path, "ammoParamsPath": None}

    ammo_component = first_matching_node(ammo_root, "SAmmoContainerComponentParams")
    if ammo_component is None:
        return {"magSize": None, "ammoSpeed": None, "damage": None, "ammoContainerPath": ammo_container.record_path, "ammoParamsPath": None}

    mag_size = float(ammo_component.attrib.get("maxAmmoCount", "0")) if ammo_component.attrib.get("maxAmmoCount") else None
    ammo_params_ref = ammo_component.attrib.get("ammoParamsRecord", "")
    ammo_params = ammo_by_ref.get(ammo_params_ref)

    return {
        "magSize": mag_size,
        "ammoSpeed": ammo_params.speed if ammo_params else None,
        "damage": ammo_params.damage if ammo_params else None,
        "ammoContainerPath": ammo_container.record_path,
        "ammoParamsPath": ammo_params.record_path if ammo_params else None,
    }


def infer_output_stats(
    result_entity: EntityInfo | None,
    quality_effects: list[dict[str, Any]],
    damage_by_ref: dict[str, DamageInfo],
    entity_by_ref: dict[str, EntityInfo],
    ammo_by_ref: dict[str, AmmoParamsInfo],
) -> list[dict[str, Any]]:
    if result_entity is None:
        return []

    try:
        entity_root = ET.parse(result_entity.path).getroot()
    except ET.ParseError:
        return []

    fire_rate = extract_weapon_fire_rate(entity_root)
    entity_mass = extract_entity_mass(entity_root)
    spread_min, spread_max = extract_weapon_spread(entity_root)
    magazine_info = extract_weapon_magazine_info(entity_root, entity_by_ref, ammo_by_ref)
    damage_mitigation, damage_record_path = extract_damage_mitigation(entity_root, damage_by_ref)
    min_temp, max_temp, radiation_capacity, radiation_dissipation = extract_armor_resistances(entity_root)

    inferred_base_values: dict[str, float] = {}
    resolved_stats: list[dict[str, Any]] = []
    entity_record_path = result_entity.record_path

    def build_provenance(
        *,
        source_types: list[str],
        source_paths: list[str],
        value_kind: str,
        derivation: str,
    ) -> dict[str, Any]:
        return {
            "sourceTypes": source_types,
            "sourceRecordPaths": [path for path in source_paths if path],
            "valueKind": value_kind,
            "derivation": derivation,
        }

    if fire_rate is not None:
        inferred_base_values["Fire Rate"] = fire_rate
        resolved_stats.append(
            {
                "stat": "Fire Rate",
                "baseValue": fire_rate,
                "unit": "RPM",
                "precision": 0,
                "valueKind": "actual",
                "effectStats": ["Fire Rate"],
                "higherIsBetter": True,
                "provenance": build_provenance(
                    source_types=["weapon-fire-action"],
                    source_paths=[entity_record_path],
                    value_kind="actual",
                    derivation="direct",
                ),
            }
        )
    if entity_mass is not None:
        resolved_stats.append(
            {
                "stat": "Mass",
                "baseValue": entity_mass,
                "unit": "",
                "precision": 2,
                "valueKind": "actual",
                "effectStats": [],
                "higherIsBetter": False,
                "provenance": build_provenance(
                    source_types=["physics-controller"],
                    source_paths=[entity_record_path],
                    value_kind="actual",
                    derivation="direct",
                ),
            }
        )
    if magazine_info["damage"] is not None:
        resolved_stats.append(
            {
                "stat": "Damage / Shot",
                "baseValue": magazine_info["damage"],
                "unit": "",
                "precision": 1,
                "valueKind": "actual",
                "effectStats": ["Damage"],
                "higherIsBetter": True,
                "provenance": build_provenance(
                    source_types=["ammo-params"],
                    source_paths=[magazine_info["ammoParamsPath"]],
                    value_kind="actual",
                    derivation="direct",
                ),
            }
        )
    if fire_rate is not None and magazine_info["damage"] is not None:
        resolved_stats.append(
            {
                "stat": "DPS",
                "baseValue": (magazine_info["damage"] * fire_rate) / 60,
                "unit": "",
                "precision": 1,
                "valueKind": "actual",
                "effectStats": ["Damage", "Fire Rate"],
                "higherIsBetter": True,
                "provenance": build_provenance(
                    source_types=["weapon-fire-action", "ammo-params", "computed"],
                    source_paths=[entity_record_path, magazine_info["ammoParamsPath"]],
                    value_kind="actual",
                    derivation="composed",
                ),
            }
        )
    if magazine_info["magSize"] is not None:
        resolved_stats.append(
            {
                "stat": "Mag",
                "baseValue": magazine_info["magSize"],
                "unit": "",
                "precision": 0,
                "valueKind": "actual",
                "effectStats": [],
                "higherIsBetter": True,
                "provenance": build_provenance(
                    source_types=["ammo-container"],
                    source_paths=[magazine_info["ammoContainerPath"]],
                    value_kind="actual",
                    derivation="direct",
                ),
            }
        )
    if magazine_info["ammoSpeed"] is not None:
        resolved_stats.append(
            {
                "stat": "Ammo Speed",
                "baseValue": magazine_info["ammoSpeed"],
                "unit": "m/s",
                "precision": 0,
                "valueKind": "actual",
                "effectStats": [],
                "higherIsBetter": True,
                "provenance": build_provenance(
                    source_types=["ammo-params"],
                    source_paths=[magazine_info["ammoParamsPath"]],
                    value_kind="actual",
                    derivation="direct",
                ),
            }
        )
    if spread_min is not None:
        resolved_stats.append(
            {
                "stat": "Spread Min",
                "baseValue": spread_min,
                "unit": "",
                "precision": 2,
                "valueKind": "actual",
                "effectStats": ["Spread"],
                "higherIsBetter": False,
                "provenance": build_provenance(
                    source_types=["weapon-spread-params"],
                    source_paths=[entity_record_path],
                    value_kind="actual",
                    derivation="direct",
                ),
            }
        )
    if spread_max is not None:
        resolved_stats.append(
            {
                "stat": "Spread Max",
                "baseValue": spread_max,
                "unit": "",
                "precision": 2,
                "valueKind": "actual",
                "effectStats": ["Spread"],
                "higherIsBetter": False,
                "provenance": build_provenance(
                    source_types=["weapon-spread-params"],
                    source_paths=[entity_record_path],
                    value_kind="actual",
                    derivation="direct",
                ),
            }
        )
    if damage_mitigation is not None:
        inferred_base_values["Damage Mitigation"] = damage_mitigation
    if min_temp is not None:
        inferred_base_values["Min Temp"] = min_temp
    if max_temp is not None:
        inferred_base_values["Max Temp"] = max_temp
    if radiation_capacity is not None:
        inferred_base_values["Radiation Capacity"] = radiation_capacity
    if radiation_dissipation is not None:
        inferred_base_values["Radiation Dissipation"] = radiation_dissipation

    output_stats: list[dict[str, Any]] = []
    seen_stats: set[str] = set()
    for output_stat in resolved_stats:
        seen_stats.add(output_stat["stat"])
        output_stats.append(output_stat)

    resolved_effect_stats = {effect_stat for output_stat in resolved_stats for effect_stat in output_stat["effectStats"]}
    for effect in quality_effects:
        stat = effect["stat"]
        if stat in seen_stats or stat in resolved_effect_stats:
            continue
        seen_stats.add(stat)

        base_value = inferred_base_values.get(stat)
        if base_value is None and effect["unit"] == "%":
            base_value = 100.0
            value_kind = "modifier"
        else:
            value_kind = "actual"
        if base_value is None:
            continue

        output_stats.append(
            {
                "stat": stat,
                "baseValue": base_value,
                "unit": effect["unit"],
                "precision": effect["precision"],
                "valueKind": value_kind,
                "effectStats": [stat],
                "higherIsBetter": higher_is_better(stat),
                "provenance": build_provenance(
                    source_types=["crafting-property"]
                    if value_kind == "modifier"
                    else ["damage-params"]
                    if stat == "Damage Mitigation" and damage_record_path
                    else ["entity-params"],
                    source_paths=effect.get("sourceRecordPaths", [])
                    if value_kind == "modifier"
                    else [damage_record_path] if stat == "Damage Mitigation" and damage_record_path else [entity_record_path],
                    value_kind=value_kind,
                    derivation="direct",
                ),
            }
        )

    output_stats.sort(key=lambda entry: entry["stat"])
    return output_stats


def parse_slot_effects(slot_select: ET.Element, property_map: dict[str, dict[str, str]], loc: dict[str, str], item_id: str) -> tuple[list[str], list[dict[str, Any]]]:
    effect_names: list[str] = []
    effects: list[dict[str, Any]] = []
    for modifier in slot_select.iter():
        if local_name(modifier.tag) != "CraftingGameplayPropertyModifierCommon":
            continue
        property_ref = modifier.attrib.get("gameplayPropertyRecord", "")
        property_info = property_map.get(property_ref, {})
        stat_name = property_info.get("canonicalName") or property_info.get("name") or property_ref
        value_range = next((child for child in modifier.iter() if local_name(child.tag).startswith("CraftingGameplayPropertyModifierValueRange")), None)
        if value_range is None:
            continue
        start_value = float(value_range.attrib.get("modifierAtStart", "1"))
        end_value = float(value_range.attrib.get("modifierAtEnd", "1"))
        effect_names.append(stat_name)
        effects.append(
            {
                "stat": stat_name,
                "startMultiplier": start_value,
                "baselineMultiplier": 1.0,
                "endMultiplier": end_value,
                "positive": end_value > start_value,
                "affectedBy": "",
                "unit": property_info.get("unitLabel", ""),
                "precision": int(property_info.get("precision", "2")),
                "sourceRecordPaths": [property_info.get("sourceRecordPath", "")],
            }
        )
    return effect_names, effects


def build_item_dataset(
    data_root: Path,
    loc: dict[str, str],
    entity_by_ref: dict[str, EntityInfo],
    resource_name_by_ref: dict[str, str],
    property_map: dict[str, dict[str, str]],
    mission_pool_map: dict[str, list[dict[str, str]]],
    damage_by_ref: dict[str, DamageInfo],
    ammo_by_ref: dict[str, AmmoParamsInfo],
) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    blueprint_files = sorted((data_root / BLUEPRINTS_ROOT).rglob("*.xml"))

    for blueprint_file in blueprint_files:
        try:
            tree = ET.parse(blueprint_file)
        except ET.ParseError:
            continue

        root = tree.getroot()
        blueprint_record = root.attrib.get("__ref", "")
        crafting_blueprint = next((node for node in root.iter() if local_name(node.tag) == "CraftingBlueprint"), None)
        if crafting_blueprint is None:
            continue

        creation_process = next(
            (
                node
                for node in crafting_blueprint.iter()
                if local_name(node.tag) == "CraftingProcess_Creation"
            ),
            None,
        )
        if creation_process is None:
            continue

        result_entity_ref = creation_process.attrib.get("entityClass", "")
        result_entity = entity_by_ref.get(result_entity_ref)
        relative_parts = list(blueprint_file.relative_to(data_root / BLUEPRINTS_ROOT).parts)
        filename_stem = blueprint_file.stem.removeprefix("bp_craft_")
        inferred_name = to_title_case(filename_stem)
        item_name = result_entity.name if result_entity else inferred_name
        manufacturer = filename_stem.split("_", 1)[0].upper()
        category_parts = infer_category_parts(relative_parts)

        recipe = next((node for node in crafting_blueprint.iter() if local_name(node.tag) == "CraftingRecipe"), None)
        if recipe is None:
            continue

        craft_time_node = next((node for node in recipe.iter() if local_name(node.tag) == "TimeValue_Partitioned"), None)
        total_seconds = 0
        if craft_time_node is not None:
            total_seconds = (
                int(craft_time_node.attrib.get("days", "0")) * 86400
                + int(craft_time_node.attrib.get("hours", "0")) * 3600
                + int(craft_time_node.attrib.get("minutes", "0")) * 60
                + int(craft_time_node.attrib.get("seconds", "0"))
            )

        mandatory_cost = next((node for node in recipe.iter() if local_name(node.tag) == "mandatoryCost"), None)
        if mandatory_cost is None:
            continue

        inputs: list[dict[str, Any]] = []
        quality_effects: list[dict[str, Any]] = []

        for slot_select in mandatory_cost.iter():
            if local_name(slot_select.tag) != "CraftingCost_Select":
                continue
            options_node = next((child for child in slot_select if local_name(child.tag) == "options"), None)
            if options_node is None:
                continue

            option_children = [child for child in list(options_node) if local_name(child.tag) != "CraftingCost_Select"]
            if not option_children:
                continue

            name_info = next((child for child in slot_select if local_name(child.tag) == "nameInfo"), None)
            debug_name = (name_info.attrib.get("debugName", "") if name_info is not None else "").strip(":")
            if debug_name.upper() == "ASPECTS":
                continue

            slot_name = resolve_loc(loc, name_info.attrib.get("displayName")) if name_info is not None else ""
            slot_name = slot_name or to_title_case(debug_name)

            effect_names, slot_effects = parse_slot_effects(slot_select, property_map, loc, filename_stem)
            for effect in slot_effects:
                effect["affectedBy"] = slot_name
            quality_effects.extend(slot_effects)

            option = option_children[0]
            option_type = local_name(option.tag)
            if option_type == "CraftingCost_Resource":
                resource_ref = option.attrib.get("resource", "")
                material_name = resource_name_by_ref.get(resource_ref, f"Resource {resource_ref[:8]}")
                quantity_node = next((child for child in option.iter() if local_name(child.tag) == "SStandardCargoUnit"), None)
                amount = float(quantity_node.attrib.get("standardCargoUnits", "0")) if quantity_node is not None else 0.0
                quantity = f"{format_number(amount)} SCU"
                input_type = "Raw"
                acquisition = "Resource input"
                material_key = slugify(material_name)
                unit = "SCU"
            elif option_type == "CraftingCost_Item":
                entity_ref = option.attrib.get("entityClass", "")
                entity_info = entity_by_ref.get(entity_ref)
                material_name = entity_info.name if entity_info else f"Item {entity_ref[:8]}"
                if entity_info is None or entity_info.input_type not in {"Raw", "Refined"}:
                    raise ValueError(f"Unclassified crafting item input for {filename_stem}: {entity_ref}")
                if entity_info.inventory_scu is None:
                    raise ValueError(f"Missing inventory volume for crafting item input in {filename_stem}: {entity_ref}")
                item_count = float(option.attrib.get("quantity", "1"))
                amount = item_count * entity_info.inventory_scu
                quantity = f"{format_number(amount)} SCU"
                input_type = entity_info.input_type
                acquisition = "Item input"
                material_key = slugify(material_name)
                unit = "SCU"
            else:
                continue

            inputs.append(
                {
                    "slot": slot_name,
                    "type": input_type,
                    "materialKey": material_key,
                    "quantity": quantity,
                    "amount": amount,
                    "unit": unit,
                    "requirement": material_name,
                    "acquisition": acquisition,
                    "minQuality": int(float(option.attrib.get("minQuality", "0"))),
                    "effects": effect_names,
                }
            )

        inputs.sort(key=lambda entry: entry["slot"])
        if not inputs:
            continue

        materials = list(dict.fromkeys(input_entry["requirement"] for input_entry in inputs))
        output_stats = infer_output_stats(result_entity, quality_effects, damage_by_ref, entity_by_ref, ammo_by_ref)
        sources = mission_pool_map.get(blueprint_record, [])
        deduped_sources: list[dict[str, str]] = []
        seen_sources: set[tuple[str, str, str, str, str]] = set()
        for source in sources:
            key = (
                source.get("kind", ""),
                source.get("missionName", ""),
                source.get("missionGiver", ""),
                source.get("missionType", ""),
                source.get("location", ""),
            )
            if key in seen_sources:
                continue
            seen_sources.add(key)
            deduped_sources.append(source)
        sources = deduped_sources
        source_status = "mapped" if sources else "unknown"

        items.append(
            {
                "id": filename_stem,
                "name": item_name,
                "manufacturer": manufacturer,
                "category": category_parts["category"],
                "subcategory": category_parts["subcategory"],
                "armorClass": category_parts["armorClass"],
                "armorSlot": category_parts["armorSlot"],
                "weaponClass": category_parts["weaponClass"],
                "blueprintName": item_name,
                "blueprintStatus": source_status,
                "blueprintSource": sources[0]["missionName"] if sources else "No mission source link found",
                "blueprintSources": sources,
                "blueprintNote": "Mission sources resolved from reward and contract records." if sources else "No mission source link found in the current reward import.",
                "craftTime": format_craft_time(total_seconds),
                "craftTimeSeconds": total_seconds,
                "inputs": inputs,
                "materials": materials,
                "qualityEffects": quality_effects,
                "outputStats": output_stats,
            }
        )

    items.sort(key=lambda item: (item["category"], item["subcategory"], item["name"]))
    return items


def render_typescript(dataset: dict[str, Any]) -> str:
    json_body = json.dumps(dataset, indent=2, ensure_ascii=True)
    return 'import type { CraftingDataset } from "./schema";\n\n' + f"export const CRAFTING_DATA: CraftingDataset = {json_body} as const;\n"


def prune_nones(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: prune_nones(child) for key, child in value.items() if child is not None}
    if isinstance(value, list):
        return [prune_nones(child) for child in value]
    return value


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-root", default=str(DEFAULT_DATA_ROOT), help="Path to the game Data directory")
    parser.add_argument("--game-version", default="4.7", help="Patch version to stamp into the dataset manifest")
    args = parser.parse_args()

    data_root = Path(args.data_root)
    loc = read_english_loc(data_root)
    entity_by_ref, resource_name_by_ref = build_entity_indexes(data_root, loc)
    property_map = build_property_map(data_root, loc)
    mission_type_by_ref = build_mission_type_map(data_root, loc)
    mission_pool_map = build_mission_pool_map(data_root, loc, mission_type_by_ref)
    damage_by_ref = build_damage_map(data_root)
    ammo_by_ref = build_ammo_params_map(data_root)
    items = build_item_dataset(data_root, loc, entity_by_ref, resource_name_by_ref, property_map, mission_pool_map, damage_by_ref, ammo_by_ref)

    categories = {item["category"] for item in items}
    manufacturers = {item["manufacturer"] for item in items}
    materials = {material for item in items for material in item["materials"]}
    source_coverage = {
        "mapped": sum(1 for item in items if item["blueprintStatus"] == "mapped"),
        "partial": sum(1 for item in items if item["blueprintStatus"] == "partial"),
        "unknown": sum(1 for item in items if item["blueprintStatus"] == "unknown"),
    }

    dataset = {
        "manifest": {
            "gameVersion": args.game_version,
            "generatedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
            "qualityBaseline": 500,
            "recordCounts": {
                "items": len(items),
                "categories": len(categories),
                "manufacturers": len(manufacturers),
                "materials": len(materials),
            },
            "sourceCoverage": source_coverage,
        },
        "items": items,
    }

    OUTPUT_PATH.write_text(render_typescript(prune_nones(dataset)), encoding="utf-8")
    print(f"Wrote {len(items)} items to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
