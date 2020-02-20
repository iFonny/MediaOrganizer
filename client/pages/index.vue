<template>
  <div>
    <br />
    <b-tabs type="is-boxed" position="is-centered" :animated="false" expanded @change="refresh">
      <b-tab-item label="Series" icon="television">
        <jdownloader-table :items="series" type="series" @refresh="refresh" />
      </b-tab-item>
      <b-tab-item label="Films" icon="filmstrip">
        <jdownloader-table :items="films" type="films" @refresh="refresh" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import JdownloaderTable from '~/components/JdownloaderTable'

export default {
  name: 'JDownloader',

  components: { JdownloaderTable },

  async asyncData({ $axios }) {
    let series = []
    let films = []

    try {
      series = await $axios.$get('/series/jdl-list')
      films = await $axios.$get('/films/jdl-list')
    } catch (error) {
      console.log(error)
    }

    return { series, films }
  },

  methods: {
    async refresh() {
      try {
        this.series = await this.$axios.$get('/series/jdl-list')
        this.films = await this.$axios.$get('/films/jdl-list')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
