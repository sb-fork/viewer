import config from 'config';

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import {
  hasAudio,
  isAudioMuted,
  isAudioReadyToPlay,
} from '~/features/audio/selectors';
import { toggleMuted } from '~/features/audio/slice';
import { rewind, togglePlayback } from '~/features/playback/actions';
import { isPlaying } from '~/features/playback/selectors';
import { loadShowFromLocalFile } from '~/features/show/actions';
import {
  canLoadShowFromLocalFile,
  getShowDuration,
  hasLoadedShowFile,
} from '~/features/show/selectors';
import ToggleValidationModeButton from '~/features/validation/ToggleValidationModeButton';
import VirtualReality from '~/icons/VirtualReality';
import { formatPlaybackTimestamp } from '~/utils/formatters';

import PlaybackSlider from './PlaybackSlider';

import OpenButton from './buttons/OpenButton';
import PlayStopButton from './buttons/PlayStopButton';
import SettingsButton from './buttons/SettingsButton';
import VolumeButton from './buttons/VolumeButton';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(transparent 0px, rgba(0, 0, 0, 0.6) 48px)',
  },
});

const noWrap = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const BottomOverlay = ({
  audioReady,
  canLoadShowFromLocalFile,
  duration,
  hasAudio,
  hasShow,
  leftText,
  muted,
  playing,
  rightText,
  onLoadShowFromLocalFile,
  onToggleMuted,
  onTogglePlayback,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <Box
      left={0}
      right={0}
      bottom={0}
      position='absolute'
      className={classes.root}
      {...rest}
    >
      <Box display='flex' alignItems='center'>
        {canLoadShowFromLocalFile && (
          <Box pl={1} mr={-1}>
            <OpenButton disabled={playing} onClick={onLoadShowFromLocalFile} />
          </Box>
        )}
        <Box px={2}>
          <PlayStopButton
            edge='start'
            disabled={!playing && (!audioReady || !hasShow)}
            playing={playing}
            onClick={onTogglePlayback}
          />
          {hasAudio ? (
            <VolumeButton muted={muted} onClick={onToggleMuted} />
          ) : null}
        </Box>
        <Box flex={1} textAlign='center'>
          <PlaybackSlider />
        </Box>
        <Box textAlign='right' pl={2}>
          {formatPlaybackTimestamp(duration)}
        </Box>
        <Box px={1}>
          {config.modes.vr && (
            <IconButton id='vr-button'>
              <VirtualReality />
            </IconButton>
          )}
          {config.modes.validation && <ToggleValidationModeButton />}
          <SettingsButton />
        </Box>
      </Box>

      {leftText || rightText ? (
        <Box
          display='flex'
          alignItems='center'
          maxWidth='100%'
          minHeight={24}
          px={2}
        >
          <Box style={noWrap}>{leftText}</Box>
          <Box flex={1}> </Box>
          <Box style={{ ...noWrap, opacity: 0.5 }} textAlign='right'>
            {rightText}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

BottomOverlay.propTypes = {
  audioReady: PropTypes.bool,
  canLoadShowFromLocalFile: PropTypes.bool,
  duration: PropTypes.number,
  hasAudio: PropTypes.bool,
  hasShow: PropTypes.bool,
  leftText: PropTypes.string,
  muted: PropTypes.bool,
  playing: PropTypes.bool,
  onLoadShowFromLocalFile: PropTypes.func,
  onToggleMuted: PropTypes.func,
  onTogglePlayback: PropTypes.func,
  rightText: PropTypes.string,
};

export default connect(
  // mapStateToProps
  (state) => ({
    audioReady: isAudioReadyToPlay(state),
    canLoadShowFromLocalFile: canLoadShowFromLocalFile(state),
    duration: getShowDuration(state),
    hasAudio: hasAudio(state),
    hasShow: hasLoadedShowFile(state),
    leftText:
      'Use arrow keys to move around (Shift to run) and E/C to change altitude. Drag the scenery to look around.',
    muted: isAudioMuted(state),
    playing: isPlaying(state),
    rightText: 'Skybrush © 2020-2021 CollMot Robotics Ltd.',
  }),
  // mapDispatchToProps
  {
    onLoadShowFromLocalFile: () => async (dispatch) => {
      await dispatch(loadShowFromLocalFile());
      await dispatch(rewind());
    },

    onToggleMuted: toggleMuted,
    onTogglePlayback: togglePlayback,
  }
)(BottomOverlay);
