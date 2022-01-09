import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { GameStyle } from '~/models';

@Module({
  name: 'gameStatus',
  stateFactory: true,
  namespaced: true
})
export default class GameStatusModule extends VuexModule {
  playing: boolean = false;
  gameStyle: GameStyle = GameStyle.classic;

  get status () {
    return this.playing;
  }

  get style () {
    return this.gameStyle;
  }

  @Mutation
  startPlaying (style: GameStyle) {
    this.gameStyle = style;
    this.playing = true;
  }

  @Mutation
  stopPlaying () {
    this.playing = false;
  }
}
