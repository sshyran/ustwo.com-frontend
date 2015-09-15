import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import he from 'he';
import get from 'lodash/object/get';
import ModuleRenderer from '../_lib/module-renderer';
import getAuthor from '../_lib/get-author';

import Flux from '../flux';

import SocialMediaSharing from '../components/social-media-sharing';

export default class PagePost extends React.Component {
  componentWillMount() {
    const page = this.props.page;
    if (page && page.slug) {
      Flux.getSocialSharesForPost();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.page && nextProps.page && nextProps.page.slug) {
      Flux.getSocialSharesForPost();
    }
  }
  render() {
    const props = this.props;
    const post = props.page;
    const category = get(post, '_embedded.wp:term.0.0', []);
    const imageURL = get(post, '_embedded.wp:attachment.1.source_url');
    const classes = classnames('page-post', `blog-label-${get(category, 'slug', 'uncategorised')}`);
    return (
      <article className={classes}>
        <style>{`
          .page-post .content-container a {
            border-bottom-color: #14C04D;
          }
        `}</style>
        <div className="hero-image" style={{backgroundImage: `url(${imageURL})`}}>
          <img className="image" src={imageURL} />
        </div>
        <div className="content-container">
          <div className="blog-category">{get(category, 'name', 'category')}</div>
          <h1 className="title">{he.decode(get(post, 'title.rendered', ''))}</h1>
          {this.renderSocialMediaSharing('side')}
          <p className="meta">By {getAuthor(post)} - <span className="date">{moment(get(post, 'date')).format('D MMMM YYYY')}</span></p>
          <hr className="rule" />
          {get(post, 'page_builder', []).map(this.getModuleRenderer(get(post, 'colors', {})))}
          <hr className="rule" />
          {this.renderSocialMediaSharing('bottom')}
          <section className="author">
            <img className="mugshot" src={get(post, '_embedded.author.0.avatar_urls.96')} />
            <h1 className="title">About {get(post, '_embedded.author.0.name')}</h1>
            <p className="desc">{get(post, '_embedded.author.0.description')}</p>
            {/*<ul className="links">
              <li className="link"><a href={get(post, 'author.links[0].href')}>{get(post, 'author.links[0].text')}</a></li>
            </ul>*/}
          </section>
        </div>
      </article>
    );
  }
  renderSocialMediaSharing = (position) => {
    const props = this.props;
    return (
      <SocialMediaSharing
        className={position}
        title={he.decode(get(props.page, 'title.rendered', ''))}
        uri={`http://ustwo.com/blog/${get(props.page, 'slug')}`}
        facebookShares={props.facebookShares}
        twitterShares={props.twitterShares}
      />
    );
  }
  getModuleRenderer(colours) {
    return (moduleData) => {
      return ModuleRenderer(moduleData, colours, () => {
        this.zebra = !this.zebra;
        return this.zebra;
      });
    };
  }
}
