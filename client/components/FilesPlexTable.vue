<template>
  <section class="section">
    <b-field label="Search">
      <b-input v-model="searchQuery" placeholder="Search..." type="search" icon="magnify" expanded />
    </b-field>

    <b-table :data="filteredItems" striped>
      <template slot-scope="props">
        <b-table-column label="Name">
          <span>{{ props.row.name }}</span>
        </b-table-column>

        <b-table-column label="Action" numeric>
          <div class="buttons" style="justify-content: flex-end;">
            <b-button v-if="type === 'films'" type="is-danger" icon-left="delete" @click="confirmDelete(props.row.fullPath)">Delete</b-button>
            <b-button type="is-info" icon-left="pencil" @click="openModalRename(props.row)">Rename</b-button>
          </div>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import ModalPlexRename from '~/components/ModalPlexRename'

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
    return { searchQuery: '' }
  },

  computed: {
    filteredItems() {
      return this.items.filter(e => e.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
    }
  },

  methods: {
    openModalRename(item) {
      this.$buefy.modal.open({
        parent: this,
        component: ModalPlexRename,
        hasModalCard: true,
        trapFocus: true,
        props: { ...item },
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

    confirmDelete(filepath) {
      this.$buefy.dialog.confirm({
        title: 'Deleting file',
        message: `Are you sure you want to <b>delete</b> this file '${filepath}' ?`,
        confirmText: 'Delete',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await this.$axios.$delete('/files/delete', { data: { filepath } })
            this.$emit('refresh')
            this.$buefy.toast.open('File deleted!')
          } catch (error) {
            this.$buefy.notification.open({
              duration: 5000,
              message: `Error: can't delete file`,
              position: 'is-top',
              type: 'is-danger',
              hasIcon: true
            })
            console.error(error)
          }
        }
      })
    }
  }
}
</script>
