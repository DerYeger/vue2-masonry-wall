import Vue, { PluginFunction, VueConstructor } from 'vue'

declare const MasonryWall: VueConstructor<Vue> & {
  install: PluginFunction<never>
}
export default MasonryWall
