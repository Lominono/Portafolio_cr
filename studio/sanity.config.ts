import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Cristian Photos Panel',

  projectId: '3vr7hd19',
  dataset: 'photospaneladmin',

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
})
