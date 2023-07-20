import { SvgIcon } from '@mui/material'
import { ReactComponent as Story } from '../assets/story.svg'

export default function StoriesIcon(props: object): JSX.Element {
  return (
    <SvgIcon {...props}>
      <Story />
    </SvgIcon>
  )
}
