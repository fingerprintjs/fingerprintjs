# Browser independent components

Some components don't change when users use a different browser on the same device, making device fingerprinting possible. This is our current understanding of what components are browser independent. Feel free to correct.

See also: [List of components that stay stable on browser refresh](stable_components.md)

----

<table>
<thead>
<tr><th>Components</th><th>Browser dependent</th></tr>
</thead>
<tr><td>userAgent</td><td>yes</td></tr>
<tr><td>language</td><td>no (most of the time)</td></tr>
<tr><td>colorDepth</td><td>no</td></tr>
<tr><td>deviceMemory</td><td>no</td></tr>
<tr><td>pixelRatio</td><td>no</td></tr>
<tr><td>hardwareConcurrency</td><td>no (but not supported by IE)</td></tr>
<tr><td>screenResolution</td><td>no</td></tr>
<tr><td>availableScreenResolution</td><td>no</td></tr>
<tr><td>timezoneOffset</td><td>no</td></tr>
<tr><td>timezone</td><td>no</td></tr>
<tr><td>sessionStorage</td><td>yes</td></tr>
<tr><td>localStorage</td><td>yes</td></tr>
<tr><td>indexedDb</td><td>yes</td></tr>
<tr><td>addBehavior</td><td>yes</td></tr>
<tr><td>openDatabase</td><td>yes</td></tr>
<tr><td>cpuClass</td><td>no</td></tr>
<tr><td>platform</td><td>no (most of the time)</td></tr>
<tr><td>doNotTrack</td><td>yes</td></tr>
<tr><td>plugins</td><td>yes</td></tr>
<tr><td>canvas</td><td>yes in practise</td></tr>
<tr><td>webgl</td><td>yes in practise</td></tr>
<tr><td>webglVendorAndRenderer</td><td>no (most of the time)</td></tr>
<tr><td>adBlock</td><td>yes</td></tr>
<tr><td>hasLiedLanguages</td><td>no</td></tr>
<tr><td>hasLiedResolution</td><td>no</td></tr>
<tr><td>hasLiedOs</td><td>no</td></tr>
<tr><td>hasLiedBrowser</td><td>no</td></tr>
<tr><td>touchSupport</td><td>no</td></tr>
<tr><td>customEntropyFunction</td><td>-</td></tr>
<tr><td>fonts</td><td>yes (most of the time)</td></tr>
<tr><td>audio</td><td>yes</td></tr>
<tr><td>enumerateDevices</td><td>? - see <a href="https://github.com/fingerprintjs/fingerprintjs/issues/498#issuecomment-560849869">#498</a></td></tr>
</table>
