from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path


def find_mise() -> str | None:
    if mise := shutil.which("mise"):
        return mise

    home = Path.home()
    candidates = [
        home / ".local" / "bin" / ("mise.exe" if os.name == "nt" else "mise"),
        Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "WinGet" / "Links" / "mise.exe",
        Path("/opt/homebrew/bin/mise"),
        Path("/usr/local/bin/mise"),
    ]

    for candidate in candidates:
        if candidate and candidate.exists():
            return str(candidate)

    return None


def main() -> int:
    command = sys.argv[1:]
    if not command:
        print("No command specified for mise wrapper.", file=sys.stderr)
        return 2

    mise = find_mise()
    if mise is None:
        print(
            "Could not find `mise`. Run the setup steps first and make sure mise is installed.",
            file=sys.stderr,
        )
        return 1

    result = subprocess.run([mise, "exec", "--", *command], check=False)
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
