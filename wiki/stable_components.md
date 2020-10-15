# Stable components

Some components change every time you refresh the page (are "unstable"). This is our current understanding of what components are unstable. Feel free to correct.

See also: [List of components that are browser independent](browser_independent_components.md)

----

<table>
<thead>
<tr><th>Component</th><th>Stable</th></tr>
</thead>
<tr><td>userAgent</td><td>yes</td></tr>
<tr><td>language</td><td>yes</td></tr>
<tr><td>colorDepth</td><td>yes</td></tr>
<tr><td>deviceMemory</td><td>yes</td></tr>
<tr><td>pixelRatio</td><td>yes</td></tr>
<tr><td>hardwareConcurrency</td><td>yes (but not supported by IE)</td></tr>
<tr><td>screenResolution</td><td>yes</td></tr>
<tr><td>availableScreenResolution</td><td>yes</td></tr>
<tr><td>timezoneOffset</td><td>yes</td></tr>
<tr><td>timezone</td><td>yes</td></tr>
<tr><td>sessionStorage</td><td>yes</td></tr>
<tr><td>localStorage</td><td>yes</td></tr>
<tr><td>indexedDb</td><td>yes</td></tr>
<tr><td>addBehavior</td><td>yes</td></tr>
<tr><td>openDatabase</td><td>yes</td></tr>
<tr><td>cpuClass</td><td>yes</td></tr>
<tr><td>platform</td><td>yes</td></tr>
<tr><td>doNotTrack</td><td>yes</td></tr>
<tr><td>plugins</td><td>yes (?)</td></tr>
<tr><td>canvas</td><td>yes (most of the time)</td></tr>
<tr><td>webgl</td><td>yes (most of the time)</td></tr>
<tr><td>webglVendorAndRenderer</td><td>yes</td></tr>
<tr><td>adBlock</td><td>yes (but may be timing dependent)</td></tr>
<tr><td>hasLiedLanguages</td><td>yes</td></tr>
<tr><td>hasLiedResolution</td><td>yes</td></tr>
<tr><td>hasLiedOs</td><td>yes</td></tr>
<tr><td>hasLiedBrowser</td><td>yes</td></tr>
<tr><td>touchSupport</td><td>yes</td></tr>
<tr><td>customEntropyFunction</td><td>-</td></tr>
<tr><td>fonts</td><td>yes (most of the time)</td></tr>
<tr><td>audio</td><td>yes (?)</td></tr>
<tr><td>enumerateDevices</td><td>no (<a href="https://github.com/Valve/fingerprintjs2/issues/375">#375</a>, <a href="https://github.com/Valve/fingerprintjs2/issues/498#issuecomment-560849869">#498</a>)</td></tr>
</table>