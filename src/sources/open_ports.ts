// Based on https://github.com/basvdlouw/port-scanner
export default async function getOpenPorts(): Promise<number[]> {
  const ipAddressToScan = '127.0.0.1'
  const nSockets = 200 // number of sockets scanning concurrently
  const socketTimeout = 200 // timeout in milliseconds
  const queue = new ConcurrentQueue(nSockets)
  const restrictedPortsSet = new Set(restrictedPorts)

  // Add ports to queue (excluding restricted ports)
  // Scanning the first 10000 ports as opposed to all ports (65535), for efficiency purposes 
  // 10000 ports should take approximately 10000 ms (10 seconds) to scan. (ports * socket timeout)/n sockets) (10000 * 200)/200
  for (let i = 1; i <= 10000; i++) {
    if (!restrictedPortsSet.has(i)) {
      queue.enqueue(i, fetchApiScan, ipAddressToScan, i, socketTimeout)
    }
  }
  return await queue.waitForCompletion()
}

class ConcurrentQueue<T, E extends any[]> {
  private readonly queue: Array<{
    item: T
    taskFunction: (...args: E) => Promise<any>
    args: E
  }> = []

  private runningCount = 0
  private completedCount = 0
  private pendingTasks = 0
  private readonly maxConcurrency: number
  private readonly openPorts: Array<number> = new Array()
  private resolvePromise: (result: Array<number>) => void = () => {}

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency
  }

  enqueue(item: T, taskFunction: (...args: E) => Promise<number | null>, ...args: E): void {
    this.queue.push({ item, taskFunction, args })
    this.pendingTasks++
    this.dequeue()
  }

  private dequeue(): void {
    if (this.runningCount >= this.maxConcurrency) {
      return
    }

    const item = this.queue.shift()
    if (item == null) {
      return
    }

    this.runningCount++

    this.runTask(item.taskFunction, ...item.args)
      .then((result) => {
        // console.log(`pending tasks: ${this.pendingTasks}`);
        // console.log(`completed tasks: ${this.completedCount}`);
        if (result) {
          this.openPorts.push(result)
        }
        this.completedCount++
        this.pendingTasks--
        this.runningCount--
        this.dequeue()
        if (this.pendingTasks === 0) {
          this.resolvePromise(this.openPorts)
        }
      })
      .catch((_error) => {
        // console.log(`pending tasks: ${this.pendingTasks}`);
        // console.log(`completed tasks: ${this.completedCount}`);
        this.completedCount++
        this.pendingTasks--
        this.runningCount--
        this.dequeue()
        if (this.pendingTasks === 0) {
          this.resolvePromise(this.openPorts)
        }
      })
  }

  waitForCompletion(): Promise<Array<number>> {
    return new Promise<Array<number>>((resolve) => {
      this.resolvePromise = resolve
    })
  }

  private async runTask(taskFunction: (...args: E) => Promise<any>, ...args: E): Promise<any> {
    return taskFunction(...args)
  }
}

const fetchApiScan = async (ipAddress: string, port: number, timeout: number): Promise<number | null> => {
  const controller = new AbortController()
  const timeoutReference = setTimeout(() => {
    controller.abort()
    return null
  }, timeout)

  const options: RequestInit = {
    mode: 'no-cors',
    signal: controller.signal,
  }

  try {
    await fetch(`http://${ipAddress}:${port}`, options)
    return port
  } catch (error) {
    return null
  } finally {
    clearTimeout(timeoutReference)
  }
}

// Restricted ports (we cannot scan these)
// https://src.chromium.org/viewvc/chrome/trunk/src/net/base/net_util.cc?view=markup#l68

const restrictedPorts: number[] = [
  1, // tcpmux
  7, // echo
  9, // discard
  11, // systat
  13, // daytime
  15, // netstat
  17, // qotd
  19, // chargen
  20, // ftp data
  21, // ftp access
  22, // ssh
  23, // telnet
  25, // smtp
  37, // time
  42, // name
  43, // nicname
  53, // domain
  77, // priv-rjs
  79, // finger
  87, // ttylink
  95, // supdup
  101, // hostriame
  102, // iso-tsap
  103, // gppitnp
  104, // acr-nema
  109, // pop2
  110, // pop3
  111, // sunrpc
  113, // auth
  115, // sftp
  117, // uucp-path
  119, // nntp
  123, // NTP
  135, // loc-srv /epmap
  139, // netbios
  143, // imap2
  179, // BGP
  389, // ldap
  465, // smtp+ssl
  512, // print / exec
  513, // login
  514, // shell
  515, // printer
  526, // tempo
  530, // courier
  531, // chat
  532, // netnews
  540, // uucp
  556, // remotefs
  563, // nntp+ssl
  587, // stmp?
  601, // ??
  636, // ldap+ssl
  993, // ldap+ssl
  995, // pop3+ssl
  2049, // nfs
  3659, // apple-sasl / PasswordServer
  4045, // lockd
  6000, // X11
  6665, // Alternate IRC [Apple addition]
  6666, // Alternate IRC [Apple addition]
  6667, // Standard IRC [Apple addition]
  6668, // Alternate IRC [Apple addition]
  6669, // Alternate IRC [Apple addition]
  0xffff, // Used to block all invalid port numbers
]
