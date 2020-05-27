import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import axios from 'axios';
import Head from './head.tsx';
import Food from './food.tsx';
import Constants from './constants.ts';
import GameLoop from './gameloops.ts';
import Tail from './tail.tsx';

const closure = () => {
  let counter: number;
  counter = 0;
  return (bool: Boolean): number | void => {
    if (bool) {
      return counter;
    }
    counter++;
  };
};

const closureFunction: Function = closure();
export {closureFunction};

interface Props {
  children: any;
}
interface State {
  running: Boolean;
}

export default class Game extends Component<Props, any> {
  constructor(props: any) {
    super(props);
    this.boardSize = Constants.GRID_SIZE * Constants.CELL_SIZE;
    this.engine = null;
    this.state = {
      running: true,
    };
  }

  onEvent = async (e) => {
    if (e.type === 'game-over') {
      Alert.alert('Game-over');
      this.setState({running: false});
      console.log(closureFunction(true));
      const count: number = closureFunction(true);
      if (count > this.props.count) {
        const data = {username: this.props.username, count: count};
        console.log(data);
        try {
          const response = await axios.put(
            'http://rachit2501.live/v1/update',
            data,
          );
          if (response.status === 200) {
            this.props.updateCount(count);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  reset = () => {
    this.engine.swap({
      head: {
        position: [0, 0],
        xspeed: 0.1,
        yspeed: 0,
        nextMove: 10,
        updateFrequency: 2,
        size: 20,
        renderer: <Head />,
      },
      food: {
        position: [
          this.randomBetween(0, Constants.GRID_SIZE - 1),
          this.randomBetween(0, Constants.GRID_SIZE - 1),
        ],
        size: 20,
        renderer: <Food />,
      },
      tail: {size: 20, elements: [], renderer: <Tail />},
    });
    this.setState({
      running: true,
    });
  };

  randomBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  render() {
    return (
      <View style={styles.container}>
        <GameEngine
          ref={(ref) => {
            this.engine = ref;
          }}
          style={{
            width: this.boardSize,
            height: this.boardSize,
            backgroundColor: '#ffffff',
            flex: null,
          }}
          entities={{
            head: {
              position: [0, 0],
              xspeed: 0.1,
              yspeed: 0,
              nextMove: 10,
              updateFrequency: 1,
              size: 20,
              renderer: <Head />,
            },
            food: {
              position: [
                this.randomBetween(0, Constants.GRID_SIZE - 1),
                this.randomBetween(0, Constants.GRID_SIZE - 1),
              ],
              size: Constants.CELL_SIZE,
              renderer: <Food />,
            },
            tail: {size: 20, elements: [], renderer: <Tail />},
          }}
          systems={[GameLoop]}
          onEvent={this.onEvent}
          running={this.state.running}
        />

        <TouchableOpacity
          title="New Game"
          style={styles.newGame}
          onPress={this.reset}>
          <Text style={{color: 'white'}}> New Game</Text>
        </TouchableOpacity>

        <Text style={{color: 'white'}}>Max Score : {this.props.count}</Text>

        {this.Controls()}
      </View>
    );
  }

  Controls = () => (
    <View style={styles.controls}>
      <View style={styles.controlRow}>
        <TouchableOpacity
          onPress={() => {
            this.engine.dispatch({type: 'move-up'});
          }}>
          <View style={styles.control}></View>
        </TouchableOpacity>
      </View>
      <View style={styles.controlRow}>
        <TouchableOpacity
          onPress={() => {
            this.engine.dispatch({type: 'move-left'});
          }}>
          <View style={styles.control}></View>
        </TouchableOpacity>
        <View style={[styles.control, {backgroundColor: null}]}></View>
        <TouchableOpacity
          onPress={() => {
            this.engine.dispatch({type: 'move-right'});
          }}>
          <View style={styles.control}></View>
        </TouchableOpacity>
      </View>
      <View style={styles.controlRow}>
        <TouchableOpacity
          onPress={() => {
            this.engine.dispatch({type: 'move-down'});
          }}>
          <View style={styles.control}></View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    width: 300,
    height: 300,
    flexDirection: 'column',
    paddingTop: 40,
  },
  controlRow: {
    left: 20,
    top: 20,
    height: 80,
    width: 260,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  control: {
    width: 80,
    height: 80,
    backgroundColor: 'blue',
    borderRadius: 20,
  },
  newGame: {
    backgroundColor: 'grey',
    top: 30,
    borderRadius: 7,
    height: 50,
    width: 90,
  },
});
