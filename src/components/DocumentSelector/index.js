// @flow
import { h, Component } from 'preact'
import { kebabCase } from '~utils/string'
import { isEmpty } from '~utils/object'
import classNames from 'classnames'
import {
  idDocumentOptions,
  poaDocumentOptions,
  type DocumentOptionsType,
} from './documentTypes'
import { localised, type LocalisedType } from '../../locales'
import { isDesktop } from '~utils/index'
import style from './style.scss'

type Props = {
  className?: string,
  documentTypes: Object,
  country?: string,
  actions: Object,
  group: string,
  nextStep: () => void,
} & LocalisedType

type WithDefaultOptions = {
  defaultOptions: () => DocumentOptionsType[],
}

const always: (any) => boolean = () => true

// The 'type' value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
class DocumentSelector extends Component<Props & WithDefaultOptions> {
  getOptions = () => {
    const { documentTypes, defaultOptions, country = 'GBR' } = this.props
    const defaultDocOptions = defaultOptions().filter(
      ({ checkAvailableInCountry = always }) => checkAvailableInCountry(country)
    )
    const checkAvailableType = isEmpty(documentTypes)
      ? always
      : (type) => documentTypes[type]
    const options = defaultDocOptions.filter(({ type }) =>
      checkAvailableType(type)
    )

    // If no valid options passed, default to defaultDocOptions
    return options.length ? options : defaultDocOptions
  }

  handleSelect = (documentType: string) => {
    const { group, actions, nextStep } = this.props
    if (group === 'proof_of_address') {
      actions.setPoADocumentType(documentType)
    } else {
      actions.setIdDocumentType(documentType)
    }
    nextStep()
  }

  renderOption = (option: DocumentOptionsType) => (
    <li>
      <button
        type="button"
        onClick={() => this.handleSelect(option.type)}
        className={classNames(style.option, {
          [style.optionHoverDesktop]: isDesktop,
        })}
        data-onfido-qa={option.type}
      >
        <div className={`${style.icon} ${style[option.icon]}`} />
        <div className={style.content}>
          <div className={style.optionMain}>
            <p className={style.label}>{option.label}</p>
            {option.hint && <div className={style.hint}>{option.hint}</div>}
            {option.warning && (
              <div className={style.warning}>{option.warning}</div>
            )}
          </div>
          {option.eStatementAccepted && (
            <div className={style.tag}>
              {this.props.translate(
                'document_selector.proof_of_address.estatements_accepted'
              )}
            </div>
          )}
        </div>
      </button>
    </li>
  )

  render() {
    const documentOptions = this.getOptions()
    const { className, translate } = this.props
    return (
      <ul
        aria-label={translate('accessibility.document_types')}
        className={classNames(style.list, className)}
      >
        {documentOptions.map(this.renderOption)}
      </ul>
    )
  }
}

const LocalisedDocumentSelector = localised(DocumentSelector)

const withDefaultOptions = (iconCopyDisplayOptionsByType: Object) => {
  const DefaultOptionedDocumentSelector = (props: Props) => (
    <LocalisedDocumentSelector
      {...props}
      defaultOptions={() => {
        const typeList = Object.keys(iconCopyDisplayOptionsByType)
        const group = props.group
        return typeList.map((type) => {
          const {
            icon = `icon-${kebabCase(type)}`,
            hint,
            warning,
            eStatementAccepted,
            checkAvailableInCountry,
          } = iconCopyDisplayOptionsByType[type]
          return {
            eStatementAccepted,
            checkAvailableInCountry,
            icon,
            type,
            label: props.translate(type),
            hint: hint
              ? props.translate(`document_selector.${group}.${hint}`)
              : '',
            warning: warning
              ? props.translate(`document_selector.${group}.${warning}`)
              : '',
          }
        })
      }}
    />
  )
  return DefaultOptionedDocumentSelector
}

export const IdentityDocumentSelector = withDefaultOptions(idDocumentOptions)

export const PoADocumentSelector = withDefaultOptions(poaDocumentOptions)
