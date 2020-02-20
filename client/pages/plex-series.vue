<template>
  <div>
    <files-plex-table :items="allSeries" type="series" @refresh="refresh" />
  </div>
</template>

<script>
import FilesPlexTable from '~/components/FilesPlexTable'

export default {
  name: 'PlexSeries',

  components: { FilesPlexTable },

  async asyncData({ $axios }) {
    let allSeries = []

    try {
      allSeries = await $axios.$get('/series/list')
    } catch (error) {
      console.log(error)
    }

    return { allSeries }
  },

  methods: {
    async refresh() {
      try {
        this.allSeries = await this.$axios.$get('/series/list')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
