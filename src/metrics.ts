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
  public save(
    key: number, 
    metrics: Metric[],
     callback: (error: Error | null) => void) {
        const stream = WriteStream(this.db)
        stream.on('error', callback)
        stream.on('close', callback)

        metrics.forEach((m: Metric) => {
          stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
        })
  
        stream.end()
      }
  public get(key: number, callback: (error: Error | null, result?: Metric[]) => void) {
    const rs = this.db.createReadStream()
    .on('data', function (data) {
      key[1]= data.key.split(':')
      console.log(data.key, '=', data.value)
    })
    .on('error', function (err) {
      console.log('Oh my!', err)
    })
    .on('close', function () {
      console.log('Stream closed')
    })
    .on('end', function () {
      console.log('Stream ended')
    })
  }
}
