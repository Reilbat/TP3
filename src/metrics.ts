import {LevelDB} from './leveldb'
import WriteStream from 'level-ws'


export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {

  private db: any 

  constructor(dbPath: string) {

    this.db = LevelDB.open(dbPath)
  }
  public del(key : number, callback: (error: Error | null, result?: Metric[]) => void) {
    console.log(`\nKey to delete: ${key}\n`)
    const stream = this.db
            .createKeyStream()

  
      .on('error',callback)
      .on('data', data => {
        if (data.split(":")[2] === key ){
          this.db.del(data, function (err) {
          });
          console.log(`Metrics deleted !`)
        }
    })
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)

    stream.on('error', callback)
    stream.on('close', callback)

    metrics.forEach((m: Metric) => {
       stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }

public get(key : number, callback: (error: Error | null, result?: Metric[]) => void) {
  const stream = this.db.createReadStream()
  var met: Metric[] = []

  stream.on('error',callback)
    .on('data', function (data) {
      const [metrics, name, k]  = data.key.split(":")
      if (key != k ){
        console.log(`\nLevelDB error: ${data} does not match key ${key}`)
      } else {
        console.log(data.key, ' = ', data.value)
      }
    })
}
}