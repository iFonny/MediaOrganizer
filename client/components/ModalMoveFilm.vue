<template>
  <div class="modal-card" style="width: auto; min-width: 58vw">
    <header class="modal-card-head">
      <p class="modal-card-title"><strong>Move</strong> {{ name }}</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Film *">
        <b-input v-model="moveFilmForm.name" placeholder="Film name" required expanded />
      </b-field>

      <b-field label="Year *">
        <b-numberinput v-model="moveFilmForm.year" min="1000" max="9999" placeholder="YEAR" required expanded />
      </b-field>

      <b-field label="Lang *">
        <b-select v-model="moveFilmForm.lang" placeholder="Lang" icon="earth" required expanded>
          <option value="VF">VF</option>
          <option value="VO">VO</option>
          <option value="VOST">VOST</option>
          <option value="VOSTFR">VOSTFR</option>
          <option value="MULTI">MULTI</option>
        </b-select>
      </b-field>

      <b-field label="Resolution">
        <div class="block">
          <b-checkbox v-model="moveFilmForm.UHD" type="is-info">UHD</b-checkbox>
          <b-checkbox v-model="moveFilmForm.moveToHR" type="is-warning">Move to 'Films (HR)'</b-checkbox>
        </div>
      </b-field>

      <p>
        <strong>Full path: </strong> <em> {{ moveFilmForm.filepath }} </em>
      </p>

      <br />

      <b-field>
        <div class="columns">
          <div class="column">
            <b-field>
              <b-checkbox v-model="moveFilmForm.overwrite" type="is-danger">Overwrite</b-checkbox>
            </b-field>
          </div>
          <div class="column">
            <b-button type="is-success" :disabled="!isMoveFilmFormFieldsValid" :loading="buttonLoading" expanded @click.prevent="moveFilm">
              Move
            </b-button>
          </div>
        </div>
      </b-field>
    </section>
  </div>
</template>

<script>
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

  data() {
    return {
      buttonLoading: false,
      moveFilmForm: {
        filepath: this.fullPath,
        name: null,
        year: null,
        lang: null,
        UHD: false,
        moveToHR: false,
        overwrite: false
      }
    }
  },

  computed: {
    isMoveFilmFormFieldsValid() {
      return !this.buttonLoading && this.moveFilmForm.filepath && this.moveFilmForm.name && this.moveFilmForm.year && this.moveFilmForm.lang
    }
  },

  async beforeMount() {
    try {
      const filmInfo = await this.$axios.$get('/films/get-film-info', { params: { filename: this.fullPath } })

      this.moveFilmForm.name = filmInfo.name
      this.moveFilmForm.year = filmInfo.year
      this.moveFilmForm.lang = filmInfo.lang
      this.moveFilmForm.UHD = filmInfo.UHD
    } catch (error) {
      this.$buefy.notification.open({
        duration: 5000,
        message: `Error: can't get film info`,
        position: 'is-top',
        type: 'is-danger',
        hasIcon: true
      })
      console.error(error)
    }
  },

  methods: {
    async moveFilm() {
      this.buttonLoading = true

      try {
        await this.$axios.$post('/films/move', this.moveFilmForm)
        this.$emit('refresh')
        this.$parent.close()
      } catch (error) {
        this.$buefy.notification.open({
          duration: 5000,
          message: `Error: can't move film`,
          position: 'is-top',
          type: 'is-danger',
          hasIcon: true
        })
        console.error(error)
      }

      this.buttonLoading = false
    }
  }
}
</script>
