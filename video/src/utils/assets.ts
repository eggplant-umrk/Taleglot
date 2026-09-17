import { staticFile } from 'remotion'

/** story01.json paths are absolute ("/stories/..."), matching the live app's
 * public/ convention. Remotion needs staticFile() (relative, no leading slash)
 * to resolve public/ assets correctly during rendering. */
export function assetSrc(path: string) {
  return staticFile(path.replace(/^\//, ''))
}
