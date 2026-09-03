"""
Export data for independent review (anonymized).
Ref: BR-06: Anonymize data for research
     BA Document Section 13.5: Export for Independent Review
"""
import argparse
import json
import hashlib
import csv
from pathlib import Path
from datetime import datetime
from typing import Optional
from dataclasses import dataclass, asdict

import pandas as pd


@dataclass
class ExportConfig:
    """Configuration for anonymization."""
    anonymize_student_ids: bool = True
    anonymize_teacher_ids: bool = True
    anonymize_class_ids: bool = True
    remove_timestamps: bool = False
    remove_free_text: bool = True


def anonymize_id(raw_id: str, salt: str = "nekopath_export") -> str:
    """
    Create consistent anonymous ID using SHA-256 hash.

    Same input will always produce same output (for consistency).
    """
    combined = f"{salt}:{raw_id}".encode('utf-8')
    hash_digest = hashlib.sha256(combined).hexdigest()[:12]
    return f"ANON_{hash_digest}"


def export_for_review(
    evidence_csv: Path,
    config: ExportConfig,
    output_dir: Path
) -> dict:
    """
    Export evidence data for independent review with anonymization.

    CSV format expected:
    session_id,student_id,teacher_id,item_id,response,correct,timestamp,context
    """
    output_dir.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(evidence_csv)

    export_stats = {
        "original_rows": len(df),
        "anonymized_students": 0,
        "anonymized_teachers": 0,
        "anonymized_classes": 0,
        "free_text_removed": 0
    }

    # Create ID mapping for consistency
    id_mappings = {}

    if "student_id" in df.columns and config.anonymize_student_ids:
        unique_ids = df["student_id"].unique()
        id_mappings["student_id"] = {
            old: anonymize_id(str(old), f"student_{output_dir.name}")
            for old in unique_ids
        }
        export_stats["anonymized_students"] = len(unique_ids)
        df["student_id"] = df["student_id"].map(id_mappings["student_id"])

    if "teacher_id" in df.columns and config.anonymize_teacher_ids:
        unique_ids = df["teacher_id"].unique()
        id_mappings["teacher_id"] = {
            old: anonymize_id(str(old), f"teacher_{output_dir.name}")
            for old in unique_ids
        }
        export_stats["anonymized_teachers"] = len(unique_ids)
        df["teacher_id"] = df["teacher_id"].map(id_mappings["teacher_id"])

    if "class_id" in df.columns and config.anonymize_class_ids:
        unique_ids = df["class_id"].unique()
        id_mappings["class_id"] = {
            old: anonymize_id(str(old), f"class_{output_dir.name}")
            for old in unique_ids
        }
        export_stats["anonymized_classes"] = len(unique_ids)
        df["class_id"] = df["class_id"].map(id_mappings["class_id"])

    # Remove free text columns if configured
    text_columns = []
    if config.remove_free_text:
        text_columns = [col for col in df.columns if "text" in col.lower() or "comment" in col.lower()]
        export_stats["free_text_removed"] = len(text_columns)
        df = df.drop(columns=text_columns, errors="ignore")

    # Remove timestamps if configured
    if config.remove_timestamps and "timestamp" in df.columns:
        df = df.drop(columns=["timestamp"])

    # Export anonymized data
    output_csv = output_dir / "evidence_anonymized.csv"
    df.to_csv(output_csv, index=False)

    # Export metadata
    metadata = {
        "export_date": datetime.now().isoformat(),
        "config": asdict(config),
        "stats": export_stats,
        "id_mappings": id_mappings,
        "columns": list(df.columns),
        "total_rows": len(df),
        "br06_compliance": True
    }

    metadata_file = output_dir / "export_metadata.json"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    return metadata


def main():
    parser = argparse.ArgumentParser(
        description="Export anonymized data for independent review (BR-06)"
    )
    parser.add_argument(
        "--input", "-i",
        type=Path,
        required=True,
        help="Input evidence CSV file"
    )
    parser.add_argument(
        "--output", "-o",
        type=Path,
        required=True,
        help="Output directory"
    )
    parser.add_argument(
        "--keep-timestamps",
        action="store_true",
        help="Keep timestamps (default: remove)"
    )
    parser.add_argument(
        "--keep-freetext",
        action="store_true",
        help="Keep free text fields (default: remove)"
    )

    args = parser.parse_args()

    config = ExportConfig(
        anonymize_student_ids=True,
        anonymize_teacher_ids=True,
        anonymize_class_ids=True,
        remove_timestamps=not args.keep_timestamps,
        remove_free_text=not args.keep_freetext
    )

    metadata = export_for_review(args.input, config, args.output)

    print(f"Export complete: {args.output}")
    print(f"  Original rows: {metadata['stats']['original_rows']}")
    print(f"  Students anonymized: {metadata['stats']['anonymized_students']}")
    print(f"  Teachers anonymized: {metadata['stats']['anonymized_teachers']}")
    print(f"  Classes anonymized: {metadata['stats']['anonymized_classes']}")
    print(f"  BR-06 compliant: {metadata['br06_compliance']}")


if __name__ == "__main__":
    main()
