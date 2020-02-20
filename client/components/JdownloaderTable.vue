<template>
  <b-table :data="items" :row-class="(row, item) => (row.type === 'directory' ? 'has-background-grey-lighter' : '')" striped>
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

      <b-table-column label="Action" width="140" numeric>
        <div class="buttons" style="justify-content: flex-end;">
          <b-button v-if="props.row.type === 'file'" type="is-warning" @click="openModalMoveToPlex(props.row)">Move</b-button>
          <b-button type="is-info" icon-right="pencil" @click="openModalEdit(props.row)" />
        </div>
      </b-table-column>
    </template>
  </b-table>
</template>

<script>
import ModalEditSerie from '~/components/ModalEditSerie'
import ModalMoveSerie from '~/components/ModalMoveSerie'

export default {
  props: {
    items: {
      type: Array,
      required: true
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
    },

    openModalEdit(item) {
      this.$buefy.modal.open({
        parent: this,
        component: ModalEditSerie,
        hasModalCard: true,
        trapFocus: true,
        props: item,
        onCancel: () => {
          this.$emit('refresh')
        },
        events: {
          refresh: () => {
            this.$emit('refresh')
          }
        }
      })
    },

    openModalMoveToPlex(item) {
      this.$buefy.modal.open({
        parent: this,
        component: ModalMoveSerie,
        hasModalCard: true,
        trapFocus: true,
        props: item,
        onCancel: () => {
          this.$emit('refresh')
        },
        events: {
          refresh: () => {
            this.$emit('refresh')
          }
        }
      })
    }
  }
}
</script>
