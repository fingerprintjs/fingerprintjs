# FingerprintJS vs. Fingerprint Identification

The main difference between FingerprintJS and [Fingerprint Identification](https://dev.fingerprint.com/docs/introduction) lies in the number of attributes collected from the browser, how they are processed, and the accuracy in identifying visitors.

Compared to FingerprintJS, Fingerprint Identification has numerous advantages. The table below compares and contrasts these two products:

<table>
  <tr>
    <th></th>
    <th>
      <h2>FingerprintJS</h2>
    </th>
    <th>
      <h2>Fingerprint Identification</h2>
    </th>
  </tr>
  <tr>
    <td colspan="3"><h3>Core Features</h3></td>
  </tr>
  <tr>
    <td>
      <strong>Basic identification input signals</strong>
      <div><i>(screen, os, device name)</i></div>
    </td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>
      <strong>Advanced identification input signals</strong>
      <div><i>(canvas, audio, fonts)</i></div>
    </td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>
      <strong>Smart signals (output)</strong>
      <div><i>(Bot detection, device, network, and user behavior)</i></div>
    </td>
    <td>-</td>
    <td><b>✓</b></td>
  </tr>
  <tr>
    <td><strong>ID Type</strong></td>
    <td>fingerprint</td>
    <td>visitorID**</td>
  </tr>
  <tr>
    <td><strong>ID Lifetime</strong></td>
    <td>Only upto a few weeks</td>
    <td>Will last several months and sometimes years</td>
  </tr>
  <tr>
    <td><strong>ID Origin</strong></td>
    <td>Client</td>
    <td>Server</td>
  </tr>
  <tr>
    <td><strong>ID Collisions</strong></td>
    <td>Quite common</td>
    <td>Very rare</td>
  </tr>
  <tr>
    <td colspan="3"><h3>Support for native mobile platforms</h3></td>
  </tr>
  <tr>
    <td><strong>Android SDK</strong></td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td><strong>iOS SDK</strong></td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td colspan="3"><h3>Support for cross-platform frameworks</h3></td>
  </tr>
  <tr>
    <td><strong>Flutter</strong></td>
    <td>-</td>
    <td><b>✓</b></td>
  </tr>
  <tr>
    <td><strong>React Native</strong></td>
    <td>-</td>
    <td><b>✓</b></td>
  </tr>
  <tr>
    <td colspan="3"><h3>Advanced Features</h3></td>
  </tr>
  <tr>
    <td>
      <strong>Incognito mode detection</strong>
      <div><i>(See our full
                list of <a href="https://dev.fingerprintjs.com/docs/browser-and-device-support/" target="_blank"
                           rel="noreferrer">supported browsers</a>)</i></div>
    </td>
    <td>-</td>
    <td><b>✓</b></td>
  </tr>
  <tr>
    <td>
      <strong>Increased accuracy</strong>
      <div><i>(Gained from additional server-side signals (e.g. 
               TLS crypto support, ipv4/v6 data. etc)</i></div>
    </td>
    <td>-</td>
    <td><b>✓</b></td>
  </tr>
  <tr>
    <td>
      <strong>Query API & realtime Webhooks</strong>
      <div><i>(Build flexible workflows)</i></div>
    </td>
    <td>-</td>
    <td><b>✓</b></td>
  </tr>
  <tr>
    <td>
      <strong>Geolocation</strong>
      <div><i>(Based on IP address)</i></div>
    </td>
    <td>-</td>
    <td><b>✓</b></td>
  </tr>
  <tr>
    <td colspan="3"><h3>Operations</h3></td>
  </tr>
  <tr>
    <td><strong>Data security</strong></td>
    <td>Depends on your infrastructure</td>
    <td>Encrypted at rest</td>
  </tr>
  <tr>
    <td><strong>Storage</strong></td>
    <td>Depends on your infrastructure</td>
    <td>Unlimited up to 1 year</td>
  </tr>
  <tr>
    <td><strong>Regions</strong></td>
    <td>Depends on your infrastructure</td>
    <td>Global, EU and Asia data centers</td>
  </tr>
  <tr>
    <td><strong>Compliance</strong></td>
    <td>Depends on your infrastructure</td>
    <td>Compliant*** with GDPR, CCPA, SOC 2 Type II, and ISO 27001</td>
  </tr>
  <tr>
    <td><strong>SLA</strong></td>
    <td>SLA is not provided.</td>
    <td>99.8% Uptime</td>
  </tr>
  <tr>
    <td><strong>Support</strong></td>
    <td>GitHub Issues/Questions. Response times varies.</td>
    <td>Dedicated support team that responds to chat, email, and calls
            within 1 business day</td>
  </tr>
  <tr>
    <td colspan="3"><h3>How to get started?</h3></td>
  </tr>  
  <tr>
    <th></th>
    <th><a href="https://github.com/fingerprintjs/fingerprintjs/" aria-label=""><span>Get it on GitHub</span></a></th>
    <th><a href="https://dashboard.fingerprintjs.com/signup/"><span>Sign up for a free 14-day trial</span></a></th>
  </tr>
</table>
<div><small>**In comparison to fingerprints, VisitorIDs are more accurate and stable identifiers because they are deduplicated, are processed further on the server, and utilize fuzzy matching.
On the other hand, fingerprint hashes become unstable across time intervals greater than 2 weeks because they rely on an exact match of all browser attributes.
</small></div>

<div><small>***The company, Fingerprint, in its role as data processor is compliant with GDPR, CCPA and SOC 2 Type II. It is also ISO 27001 certified.
As a data controller, it is still your responsibility to be compliant with GDPR and CCPA and use the identification result for legitimate purposes.
</small></div>