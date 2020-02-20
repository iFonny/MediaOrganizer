<template>
  <div class="modal-card" style="width: auto; min-width: 58vw;">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ name }}</p>
    </header>
    <section class="modal-card-body">
      <div class="content">
        <p><strong>Name: </strong> {{ name }}</p>
        <p>
          <strong>Full path: </strong> <em> {{ fullPath }} </em>
        </p>
        <p><strong>Size: </strong> {{ getSizeInMo(size) }} Mo ({{ getSizeInGo(size) }} Go)</p>

        <p>
          <strong>Type: </strong> <b-tag type="is-info">{{ type }}</b-tag> <b-tag v-if="extension" type="is-dark">{{ extension }}</b-tag>
        </p>

        <p v-if="type === 'directory'"><strong>Numbers of files: </strong> {{ numbersOfFiles }}</p>
      </div>

      <div v-if="type === 'file'" class="columns">
        <div class="column">
          <b-button type="is-info" icon-left="filmstrip" expanded>Move to Films (JDL)</b-button>
        </div>
        <div class="column">
          <b-button type="is-warning" expanded @click="openModalMoveToPlex($props)">Move to Series (Plex)</b-button>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <b-button type="is-danger" expanded @click.prevent="confirmForceDelete(fullPath)">Force delete</b-button>
        </div>
        <div v-if="type !== 'directory'" class="column">
          <b-button type="is-danger" expanded outlined @click.prevent="confirmDelete(fullPath)">Delete</b-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ModalMoveSerie from '~/components/ModalMoveSerie'

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    fullPath: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    extension: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    numbersOfFiles: {
      type: Number,
      required: true
    }
  },

  methods: {
    getSizeInMo(size) {
      return parseFloat(size / 1000000).toFixed(2)
    },

    getSizeInGo(size) {
      return parseFloat(size / 1000000000).toFixed(4)
    },

    openModalMoveToPlex(item) {
      this.$buefy.modal.open({
        parent: this,
        component: ModalMoveSerie,
        hasModalCard: true,
        trapFocus: true,
        props: item
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
            this.$parent.close()
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
    },

    confirmForceDelete(filepath) {
      this.$buefy.dialog.confirm({
        title: 'FORCE Deleting file or directory',
        message: `Are you sure you want to <b>FORCE delete</b> this file or directory '${filepath}' ?`,
        confirmText: 'Delete',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await this.$axios.$delete('/files/delete', { data: { filepath, force: true } })
            this.$emit('refresh')
            this.$parent.close()
            this.$buefy.toast.open('File deleted!')
          } catch (error) {
            this.$buefy.notification.open({
              duration: 5000,
              message: `Error: can't delete file or directory`,
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
