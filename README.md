# ep_default_colors_off

Sets Etherpad's initial authorship-color preference to off while preserving the user's ability to change that preference afterward.

## Installation

From the Etherpad directory:

```sh
pnpm run plugins i ep_default_colors_off
```

Restart Etherpad after installation. No configuration is required for the default behavior.

## Optional timeslider colors

Live editing and revision history can use different defaults. To keep live authorship colors off while forcing them on in Etherpad's embedded timeslider, add this block to `settings.json`:

```json
{
  "ep_default_colors_off": {
    "timesliderColorsOn": true
  }
}
```

`timesliderColorsOn` defaults to `false`. Enabling it affects only the historical document embedded by the timeslider; it does not overwrite the user's live-editor preference.

## Development

```sh
pnpm install --frozen-lockfile
pnpm test
```

Licensed under the Apache License 2.0.
