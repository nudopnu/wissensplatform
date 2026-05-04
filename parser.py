"""
Parses markdown files into the MacroStep/MidStep/LeafStep JSON structure
consumed by the Angular app (src/app/models/instruction.ts).

Markdown format:
  # Macro Step Title            → macro step
  ## Mid Step Title             → mid-level collapsible section (optional)
  - [ ] Leaf description        → leaf checkbox
  - [ ] Leaf [i](media.mp4)    → leaf with info panel (image/video → ![](path))
  - [ ] Leaf [i](notes.md)     → leaf with info panel (markdown file content)
  - [ ] Leaf [i](file.md)
    > Info panel title          → leaf with info.title + file content
  - [ ] Leaf (no file)
    > Inline **markdown**       → leaf with inline info.content (no title)
    > More lines joined

IDs are deterministic (MD5 of content path) so checked-state survives re-parses
as long as the content doesn't change.
"""

import hashlib
import json
import re
import sys
from pathlib import Path

_INFO_LINK_RE = re.compile(r'\[i\]\(([^)]+)\)', re.IGNORECASE)
_CHECKBOX_RE = re.compile(r'^- \[[ xX]\] (.+)$')
_MEDIA_EXTS = {'.png', '.jpg', '.jpeg', '.gif', '.mp4', '.webm', '.mov', '.svg', '.webp'}


def _make_id(*parts: str) -> str:
    return hashlib.md5('|'.join(parts).encode()).hexdigest()[:8]


def _info_content(ref: str, base_dir: Path) -> str:
    """For media files, produce a markdown image embed. For .md files, read content."""
    suffix = Path(ref).suffix.lower()
    if suffix in _MEDIA_EXTS:
        return f'![](content/{ref})'
    full = base_dir / ref
    if full.exists():
        return full.read_text(encoding='utf-8').strip()
    return f'*(Info-Datei nicht gefunden: {ref})*'


def parse_file(md_text: str, source_name: str, base_dir: Path) -> list[dict]:
    macros: list[dict] = []
    current_macro: dict | None = None
    current_mid: dict | None = None

    lines = md_text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]

        # Macro step: # Title
        if line.startswith('# ') and not line.startswith('## '):
            title = line[2:].strip()
            current_macro = {
                'id': _make_id(source_name, title),
                'title': title,
                'mids': [],
            }
            macros.append(current_macro)
            current_mid = None

        # Mid step: ## Title
        elif line.startswith('## '):
            title = line[3:].strip()
            if current_macro is not None:
                current_mid = {
                    'id': _make_id(source_name, current_macro['title'], title),
                    'title': title,
                    'leaves': [],
                }
                current_macro['mids'].append(current_mid)

        # Leaf: - [ ] Description [i](optional-ref)
        elif m := _CHECKBOX_RE.match(line):
            if current_macro is None:
                i += 1
                continue

            raw = m.group(1).strip()
            info_match = _INFO_LINK_RE.search(raw)
            ref = info_match.group(1) if info_match else None
            description = _INFO_LINK_RE.sub('', raw).strip() if info_match else raw

            # Collect indented blockquote lines that follow this leaf
            j = i + 1
            blockquote: list[str] = []
            while j < len(lines):
                stripped = lines[j].lstrip()
                if stripped.startswith('> '):
                    blockquote.append(stripped[2:])
                    j += 1
                else:
                    break

            # Build info object
            info: dict | None = None
            if ref:
                info = {'content': _info_content(ref, base_dir)}
                if blockquote:
                    info['title'] = ' '.join(blockquote).strip()
            elif blockquote:
                info = {'content': '\n'.join(blockquote)}

            # Ensure an implicit mid exists when leaves appear directly under a macro
            if current_mid is None:
                current_mid = {
                    'id': _make_id(source_name, current_macro['title'], '__root__'),
                    'leaves': [],
                }
                current_macro['mids'].append(current_mid)

            leaf: dict = {
                'id': _make_id(source_name, current_macro['title'],
                               current_mid.get('title', ''), description),
                'description': description,
            }
            if info:
                leaf['info'] = info
            current_mid['leaves'].append(leaf)

            if blockquote:
                i = j - 1  # skip consumed lines

        i += 1

    return macros


def parse_dir(content_dir: Path) -> list[dict]:
    """Parse all *.md files in a directory (sorted by name) and merge results."""
    all_macros: list[dict] = []
    for md_file in sorted(content_dir.glob('*.md')):
        text = md_file.read_text(encoding='utf-8')
        all_macros.extend(parse_file(text, md_file.stem, content_dir))
    return all_macros


def sync(content_dir: Path, app_dir: Path) -> None:
    """Parse content and copy assets into the Angular app directory (mirrors CI)."""
    import shutil

    result = parse_dir(content_dir)

    steps_json = app_dir / 'public' / 'content' / 'steps.json'
    steps_json.parent.mkdir(parents=True, exist_ok=True)
    steps_json.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'wrote {steps_json}')

    src_info = content_dir / 'info'
    dst_info = app_dir / 'public' / 'content' / 'info'
    if src_info.exists():
        if dst_info.exists():
            shutil.rmtree(dst_info)
        shutil.copytree(src_info, dst_info)
        count = sum(1 for _ in dst_info.iterdir())
        print(f'copied {count} files to {dst_info}')
    else:
        print(f'warning: info/ not found at {src_info}', file=sys.stderr)


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Parse markdown content into steps.json')
    parser.add_argument('content', nargs='?', default='.', help='markdown file or content/ directory')
    parser.add_argument('--sync', metavar='APP_DIR',
                        help='write steps.json and copy info/ assets into APP_DIR (mirrors CI)')
    args = parser.parse_args()

    path = Path(args.content)

    if args.sync:
        if not path.is_dir():
            print('error: --sync requires a content directory, not a file', file=sys.stderr)
            sys.exit(1)
        sync(path, Path(args.sync))
    else:
        if path.is_file():
            result = parse_file(path.read_text(encoding='utf-8'), path.stem, path.parent.parent)
        else:
            result = parse_dir(path)
        print(json.dumps(result, ensure_ascii=False, indent=2))
