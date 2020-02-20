<template>
  <div>
    <files-moving-table :items="movingFiles" />
  </div>
</template>

<script>
import FilesMovingTable from '~/components/FilesMovingTable'

export default {
  name: 'Moving',

  components: { FilesMovingTable },

  async asyncData({ $axios }) {
    let movingFiles = []

    try {
      movingFiles = await $axios.$get('/files/moving-list')
    } catch (error) {
      console.log(error)
    }

    return { movingFiles }
  },

  methods: {
    async refresh() {
      try {
        this.movingFiles = await this.$axios.$get('/files/moving-list')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
