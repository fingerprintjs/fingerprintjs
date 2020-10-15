#### Browser tampering/randomization/substitution

Some users may try to cheat browser identification libraries by overriding their browser identifiers, such as UserAgent, screen resolution and OS name.
They can run special builds of browsers, that randomize these identifiers or use special browser plugins, that randomize the browser identifiers by
injecting JavaScript code on every page load.

For these users the fingerprinting works less efficiently, because they produce different FPs each time it is run.

While this library will not help to detect such users (yet), it will use the available information about users' attempts to randomize/substitute their browser identifiers
as additional sources of fingerprinting entropy. The word 'tampering' in the README refers to these mechanisms of randomization/substitution etc.
