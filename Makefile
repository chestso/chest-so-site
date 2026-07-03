.PHONY: format

JS_FILES   = main.js users.js i18n.js
CSS_FILES  = style.css users.css
HTML_FILES = index.html thomasc/index.html
JSON_FILES = users.json thomasc/projects.json
SH_FILES   = serve.sh

format:
	@echo "→ Formatting JS/CSS/HTML/JSON with prettier…"
	@prettier --write --no-config \
		--print-width 80 \
		--tab-width 2 \
		--single-quote \
		--trailing-comma all \
		--arrow-parens always \
		$(JS_FILES) $(CSS_FILES) $(HTML_FILES) $(JSON_FILES)
	@echo "→ Formatting shell scripts with shfmt…"
	@shfmt -i 2 -ci -w $(SH_FILES)
	@echo "→ Done."
