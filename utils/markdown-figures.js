// A standalone image with a Markdown title becomes a captioned figure:
// ![Accessible description](/image.png "Visible caption")
export default function markdownFigures(md) {
  md.core.ruler.after('inline', 'figures', state => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length - 2; i++) {
      const [open, inline, close] = tokens.slice(i, i + 3);
      if (open.type !== 'paragraph_open' || inline.type !== 'inline' ||
          close.type !== 'paragraph_close' || inline.children?.length !== 1) {
        continue;
      }

      const image = inline.children[0];
      if (image.type !== 'image' || !image.attrGet('title')) {
        continue;
      }

      const caption = image.attrGet('title');
      image.attrs.splice(image.attrIndex('title'), 1);
      open.type = 'figure_open';
      open.tag = 'figure';
      close.type = 'figure_close';
      close.tag = 'figure';

      const captionOpen = new state.Token('figcaption_open', 'figcaption', 1);
      const captionText = new state.Token('text', '', 0);
      captionText.content = caption;
      const captionInline = new state.Token('inline', '', 0);
      captionInline.children = [captionText];
      const captionClose = new state.Token('figcaption_close', 'figcaption', -1);
      tokens.splice(i + 2, 0, captionOpen, captionInline, captionClose);
    }
  });
}
