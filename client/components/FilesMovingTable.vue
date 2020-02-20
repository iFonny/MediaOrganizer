<template>
  <section class="section">
    <b-field grouped group-multiline>
      <div class="control">
        <b-switch v-model="hideFolders">Hide folders</b-switch>
      </div>
    </b-field>

    <b-table :data="filteredItems" :row-class="(row, item) => (row.type === 'directory' ? 'has-background-grey-lighter' : '')" striped>
      <template slot-scope="props">
        <b-table-column label="Name">
          <div>
            <b-icon v-if="props.row.type === 'directory'" icon="folder-outline" size="is-small"></b-icon>
            <b-tag v-if="getSplitedDirectoryPath(props.row.path)" type="is-dark"> {{ getSplitedDirectoryPath(props.row.path) }}</b-tag>
            <span>{{ props.row.name }}</span>
          </div>
        </b-table-column>

        <b-table-column label="Size" width="150" numeric>
          <b-taglist attached style="justify-content: flex-end;">
            <b-tag v-if="getSizeInGo(props.row.size) > 0.009" type="is-success">{{ getSizeInGo(props.row.size) }}Go</b-tag>
            <b-tag v-if="props.row.type === 'directory'" type="is-info">{{ props.row.numbersOfFiles }} files</b-tag>
          </b-taglist>
        </b-table-column>

        <b-table-column label="Last change" width="150" numeric>
          <b-tag type="is-success">{{ props.row.ctime }}</b-tag>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },

  data() {
    return { hideFolders: true }
  },

  computed: {
    filteredItems() {
      return this.items.filter(e => (this.hideFolders ? (e.type === 'directory' ? false : true) : true))
    }
  },

  methods: {
    getSplitedDirectoryPath(path) {
      path = path.split('/')
      path.pop()
      return path.length > 0 ? path.join(' / ') : null
    },

    getSizeInGo(size) {
      return parseFloat(size / 1000000000).toFixed(2)
    }
  }
}
</script>
