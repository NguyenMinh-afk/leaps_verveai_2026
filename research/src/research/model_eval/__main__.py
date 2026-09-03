"""Entry point chung — `python -m research.model_eval <test_a|test_b> ...`.

Giúp CI/CD hoặc Makefile chạy được cả 2 bài kiểm với cùng cú pháp.
"""

from __future__ import annotations

import sys
from typing import Sequence

USAGE = """Usage: python -m research.model_eval <command> [args...]

Commands:
  test_a    Chạy Bài kiểm A — chất lượng trích xuất (kappa).
  test_b    Chạy Bài kiểm B — hiệu năng thiết bị.
"""


def main(argv: Sequence[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    if not args or args[0] in {"-h", "--help"}:
        print(USAGE)
        return 0

    cmd, rest = args[0], args[1:]
    if cmd == "test_a":
        from research.model_eval.test_a_extraction_quality import main as m
        return m(rest)
    if cmd == "test_b":
        from research.model_eval.test_b_device_performance import main as m
        return m(rest)
    print(f"Unknown command: {cmd}\n{USAGE}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())