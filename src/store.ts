import * as ConfigStore from 'configstore'

class Store {
  private store = new ConfigStore('mania-editor', {
    lastBeatmap: '',
  })

  get lastBeatmap() {
    return this.store.get('lastBeatmap')
  }

  set lastBeatmap(value: string) {
    this.store.set('lastBeatmap', value)
  }
}

export const store = new Store()
