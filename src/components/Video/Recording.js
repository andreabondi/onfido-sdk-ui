// @flow
import { h } from 'preact'
import Challenge, { type ChallengeType } from './Challenge'
import classNames from 'classnames'
import Button from '../Button'
import style from './style.scss'
import { localised, type LocalisedType } from '../../locales'

type Props = {
  currentChallenge: ChallengeType,
  isLastChallenge: boolean,
  hasError: boolean,
  disableInteraction: boolean,
  onNext: (void) => void,
  onStop: (void) => void,
} & LocalisedType

const Recording = ({
  onStop,
  onNext,
  currentChallenge,
  isLastChallenge,
  disableInteraction,
  translate,
}: Props) => (
  <div>
    <div className={style.caption}>
      <div>
        <div className={style.recordingIndicator}>
          <span role="status" className={style.recordingIndicatorText}>
            {translate('capture.liveness.recording')}
          </span>
        </div>
        <Challenge {...{ ...currentChallenge }} />
      </div>
    </div>
    <div className={style.actions}>
      <div className={style.captureActionsHint}>
        {translate(
          `capture.liveness.challenges.done_${
            isLastChallenge ? 'stop' : 'next'
          }`
        )}
      </div>
      {!isLastChallenge ? (
        <Button
          variants={['centered', 'primary', 'lg']}
          disabled={disableInteraction}
          onClick={onNext}
        >
          {translate('capture.liveness.challenges.next')}
        </Button>
      ) : (
        <button
          type="button"
          aria-label={translate('accessibility.stop_recording')}
          disabled={disableInteraction}
          onClick={onStop}
          className={classNames(style.btn, style.stopRecording)}
        />
      )}
    </div>
  </div>
)

export default localised(Recording)
