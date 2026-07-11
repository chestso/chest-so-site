.PHONY: format

JS_FILES   = main.js users.js common.js i18n.js assets/icons.js
TS_FILES   = worker/index.ts
CSS_FILES  = style.css users.css
HTML_FILES = index.html thomasc/index.html
JSON_FILES = users.json projects.json thomasc/projects.json
SH_FILES   = serve.sh

format:
	@echo "→ Formatting JS/CSS/HTML/JSON with prettier…"
	@prettier --write \
		$(JS_FILES) $(TS_FILES) $(CSS_FILES) $(HTML_FILES) $(JSON_FILES)
	@echo "→ Formatting shell scripts with shfmt…"
	@shfmt -i 2 -ci -w $(SH_FILES)
	@echo "→ Done."
