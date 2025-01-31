import Link from "@node_modules/next/link";
import {slug} from "github-slugger";

export function Tag({ tag , count }) {
    return <Link className="tag-container" href={`/tags/${slug(tag)}`}>{tag} {count ? `[${count}]`: null}</Link>;
}

// not sure it needed for now (code below)

// // Add PropTypes validation
// Tag.propTypes = {
//     tag: PropTypes.string.isRequired,
//     current: PropTypes.bool,
//     count: PropTypes.number,
// };

// // Add default props
// Tag.defaultProps = {
//     current: false,
//     count: 0,
// };