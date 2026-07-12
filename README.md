# README

## What is this?
This plugin sets the setAuthorshipColors and setAuthorColor values in the prefs cookie to default false tolerating client preferences afterward. I needed this for my own project requirements (so you can consider it experimental). Use at your own risk!

## Optional timeslider colors

Live editing and history can use different defaults. To keep live authorship
colors off while forcing them on in Etherpad's in-place timeslider, add:

```json
"ep_default_colors_off": {
  "timesliderColorsOn": true
}
```

The option defaults to `false`. It changes only the embedded historical
document and does not overwrite the user's live-view preference cookie.

## License
Apache 2

## Development
Development courtesy of me but mainly gemini-2.5-pro-exp-03-25.

## Author
Daniel Castelone
