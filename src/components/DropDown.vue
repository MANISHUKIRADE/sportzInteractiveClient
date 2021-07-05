<template>
  <v-container fluid>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog transition="dialog-top-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="red" v-bind="attrs" v-on="on">Add Country</v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark></v-toolbar>
              <v-card>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="newCountry.name"
                    color="purple darken-2"
                    label="Country Name"
                    required
                  ></v-text-field>
                  <v-select
                    v-model="newCountry.continent"
                    :items="continents"
                    label="Select Country"
                    :loading="loader"
                    solo
                  ></v-select>
                  <v-file-input
                    v-model="file"
                    accept="image/png, image/jpeg, image/bmp"
                    label="File input"
                    :rules="rules"
                  ></v-file-input>
                </v-col>
                <v-btn color="green" @click="addCountry()">Save</v-btn>
              </v-card>
              <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col class="d-flex" cols="12" sm="6">
        <v-select
          v-model="selectedCountry"
          :items="items"
          label="Select Country"
          :loading="loader"
          solo
          @change="fetchCountryById()"
        ></v-select>
      </v-col>
    </v-row>
    <v-row
      align="center"
      v-if="
        selectedCountryDetail !== null && selectedCountryDetail !== undefined
      "
    >
      <v-col class="d-flex" cols="12" sm="6" max-width="344">
        <p class="text-h2 text--primary">
          {{ selectedCountryDetail.name }}
        </p>
      </v-col>
      <v-col class="d-flex" cols="12" sm="6" max-width="344">
        <p class="text-h2 text--primary">
          Rank: {{ selectedCountryDetail.rank }}
        </p>
      </v-col>

      <v-col class="d-flex" cols="12" sm="6" max-width="344">
        <p class="text-h2 text--primary">
          continent: {{ selectedCountryDetail.continent }}
        </p>
      </v-col>

      <v-col class="d-flex" cols="12" sm="6" max-width="344">
        <v-img
          max-height="150"
          max-width="250"
          :src="selectedCountryDetail.url"
        ></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '../services/api'
export default {
  name: 'DropDown',
  data () {
    return {
      file: '',
      rules: [
        value =>
          !value ||
          value.size < 2000000 ||
          'Image size should be less than 2 MB!'
      ],

      continents: [
        { text: 'Africa', value: 'Africa' },
        { text: 'Oceania', value: 'Oceania' },
        { text: 'Asia', value: 'Asia' },
        { text: 'Europe', value: 'Europe' }
      ],
      newCountry: {},
      selectedCountryDetail: null,
      selectedCountry: null,
      loader: true,
      items: []
    }
  },
  mounted: function () {
    this.fetchList()
  },
  methods: {
    fetchCountryById: async function () {
      const id = this.selectedCountry
      this.selectedCountryDetail = await api.getCountryById(id)
      this.selectedCountryDetail.url =
        'http://localhost:8080/' + this.selectedCountryDetail.flag
      console.log(this.selectedCountryDetail)
    },
    fetchList: async function () {
      try {
        this.items = await api.getList()
        this.items.forEach(element => {
          element['text'] = element['name']
          element['value'] = element['id']
        })
        console.log(this.items)
      } catch (err) {
        console.log(err)
      }
    },
    addCountry: async function () {
      let config = {
        onUploadProgress: function (progressEvent) {
          this.progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      }

      let formData = new FormData()
      formData.append('file', this.file)
      formData.append('name', this.newCountry.name)
      formData.append('continent', this.newCountry.continent)
      let newobject = await api.addCountry(formData, config)
      return newobject
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
