<template>
  <section>
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

        <b-table-column label="Action" width="140" numeric>
          <div class="buttons" style="justify-content: flex-end;">
            <b-button v-if="props.row.type === 'file'" type="is-warning" @click="openModalMoveToPlex(props.row)">Move</b-button>
            <b-button type="is-info" icon-right="pencil" @click="openModalEdit(props.row)" />
          </div>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import ModalEditSerie from '~/components/ModalEditSerie'
import ModalMoveSerie from '~/components/ModalMoveSerie'
import ModalMoveFilm from '~/components/ModalMoveFilm'

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    type: {
      type: String, // series | films
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
    },

    openModalEdit(item) {
      this.$buefy.modal.open({
        parent: this,
        component: ModalEditSerie,
        hasModalCard: true,
        trapFocus: true,
        props: { ...item, modalType: this.type },
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
      if (this.type === 'series') return this.openModalMoveToPlexSeries(item)
      if (this.type === 'films') return this.openModalMoveToPlexFilms(item)
    },

    openModalMoveToPlexSeries(item) {
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
    },

    openModalMoveToPlexFilms(item) {
      this.$buefy.modal.open({
        parent: this,
        component: ModalMoveFilm,
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
