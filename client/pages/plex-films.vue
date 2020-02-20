<template>
  <div>
    <files-plex-table :items="allFilms" type="films" @refresh="refresh" />
  </div>
</template>

<script>
import FilesPlexTable from '~/components/FilesPlexTable'

export default {
  name: 'PlexFilms',

  components: { FilesPlexTable },

  async asyncData({ $axios }) {
    let allFilms = []

    try {
      allFilms = await $axios.$get('/films/list')
    } catch (error) {
      console.log(error)
    }

    return { allFilms }
  },

  methods: {
    async refresh() {
      try {
        this.allFilms = await this.$axios.$get('/films/list')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
