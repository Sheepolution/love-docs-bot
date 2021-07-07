# LÖVE Docs

A Discord bot for querying documentation for the LÖVE API.

[Invite the bot](https://discord.com/api/oauth2/authorize?client_id=855477819848392734&permissions=18432&scope=bot)

### How to use
Use `love>api [query]` to search through the LÖVE and Lua API. You can edit your message to update the bot's message.

### Mod Commands
`love>prefix [prefix]` 

Change the prefix.

`love>channel add/remove`

Add or remove the channel where this command is used to the list of channels where the bot is active. If no channels have been added the bot can be used in all channels.

`love>role [role]`

Restrict access to the bot to members with a certain role. Use `love>role everyone` if you want to remove the role restriction.

### Example usage

![](https://cdn.discordapp.com/attachments/817036396790939718/857868604435070986/unknown.png)

## Libraries

Besides the LÖVE API, LÖVE Docs also supports querying through libraries.

### How to use

Use `love>lib [query]` to search for a library.

Use `love>lib [library] [query]` to search through a library's documentation.

### Supported libraries

So far no libraries are supported. You can make a pull request to add documentation for your or someone else's library.

### Adding a library

You can add a library by extending [DocsLibs.json](code/src/Data/DocsLibs.json). The JSON is structured as followed:

```js
{
    "name": "step",
    "author": "Sheepolution",
    "description": "A small immediate mode timer module that makes it easier to have an action execute with a certain interval or after a delay.",
    "url": "https://github.com/sheepolution/step",

    // Optional. "." by default. Should be either "." or ":".
    "callType": ".", 
    "api": [
        {
            "name": "every",

            // Optional.
            "arguments": "duration, [max_duration]", 
            "description": "Creates a timer which returns true every `duration` seconds. If `max_duration` is set the duration will be a random float between `duration` and `max_duration` every loop.",

            // Optional. True by default.
            "callable": true,

            // Optional.
            "example": "timer = step.every(3)\nif timer:update(dt) then\n  print(\"This will be printed every 3 seconds\")\nend"
        },
        {
            // By default the function will be shown as the library's name + the function's name.
            // By putting a "." or ":" in your function's name the library's name will not be used.
            // This way you can also use a different callType. You can put the library's name in the function's name in that case.
            "name": "timer:reset",
            "description": "Resets the timer.",
        },
    ]
}
```