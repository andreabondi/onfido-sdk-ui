import { h } from 'preact'
import classNames from 'classnames'
import { localised } from '../../locales'
import Actions from './Actions'
import CaptureViewer from './CaptureViewer'
import PageTitle from '../PageTitle'
import Error from '../Error'
import theme from '../Theme/style.scss'
import style from './style.scss'

const getMessageKey = ({
  capture,
  documentType,
  error,
  forceRetake,
  method,
}) => {
  if (method === 'face') {
    return `confirm.face.${capture.variant}.message`
  }

  // In case of real error encountered but there's a `forceRetake` flag activated
  if (error && error.type === 'error') {
    return `confirm.${documentType}.message`
  }

  if (forceRetake) {
    return 'confirm.document_image_poor.message'
  }

  if (error && error.type === 'warn') {
    return 'confirm.document_image_medium.message'
  }

  return `confirm.${documentType}.message`
}

const Previews = localised(
  ({
    capture,
    retakeAction,
    confirmAction,
    error,
    method,
    documentType,
    translate,
    isFullScreen,
    isUploading,
    forceRetake,
  }) => {
    const methodNamespace =
      method === 'face'
        ? `confirm.face.${capture.variant}`
        : `confirm.${method}`
    const title = translate(`${methodNamespace}.title`)
    const imageAltTag = translate(`${methodNamespace}.alt`)
    const videoAriaLabel = translate('accessibility.replay_video')
    const message = translate(
      getMessageKey({ capture, documentType, error, forceRetake, method })
    )

    return (
      <div
        className={classNames(
          style.previewsContainer,
          theme.fullHeightContainer,
          {
            [style.previewsContainerIsFullScreen]: isFullScreen,
          }
        )}
      >
        {isFullScreen ? null : error.type ? (
          <Error
            {...{ error, withArrow: true, role: 'alert', focusOnMount: false }}
          />
        ) : (
          <PageTitle title={title} smaller={true} className={style.title} />
        )}
        <CaptureViewer
          {...{ capture, method, isFullScreen, imageAltTag, videoAriaLabel }}
        />
        {!isFullScreen && (
          <div>
            <p className={style.message}>{message}</p>
            <Actions
              {...{
                retakeAction,
                confirmAction,
                isUploading,
                error,
                forceRetake,
              }}
            />
          </div>
        )}
      </div>
    )
  }
)

export default Previews
