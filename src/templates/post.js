import React from 'react'
import { Container, Card, CardTitle, CardGroup, CardBody } from 'reactstrap'
import Helmet from 'react-helmet'
import graphql from 'graphql'
import { basename } from 'path'
import Link from 'gatsby-link'

// find a post title by path
const findNode = (path, data) => data.allMarkdownRemark.edges
  .map(edge => edge.node.frontmatter)
  .filter(r => r.path === path)
  .pop()

export default function Template ({ data }) {
  const { markdownRemark: post } = data
  const related = post.frontmatter.related ? post.frontmatter.related.map(r => findNode(r.post, data)) : []
  return (
    <div className='container bg-white p-3 pt-3'>
      <Helmet title={`Post | ${post.frontmatter.title}`}>
        {data.site.siteMetadata.disqus && (
          <script id='dsq-count-scr' src='//gatsby-starter-blog.disqus.com/count.js' async />
        )}
        {data.site.siteMetadata.disqus && (
          <script>{`(function() {
          var d = document, s = d.createElement('script');
          s.src = 'https://${data.site.siteMetadata.disqus}.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
          })();`}</script>
        )}
      </Helmet>

      <Container>
        <div className="header">
          <nav className="navbar navbar-expand-sm mb-3 p-2 bd-highlight">
            <div className="navbar-collapse justify-content-center">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link" href="/">Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="mailto:hughpearse@gmx.co.ukSubject=Weblog" target="_top">Email</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="https://www.linkedin.com/in/hughpearse/">LinkedIn</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="https://github.com/hughpearse">GitHub</a>
                  </li>
                </ul>
            </div>
          </nav>
        </div>
      </Container>
      <center><h1 className='display-3'><a href="#">Hugh Pearse</a></h1></center>

      <Container>
        <h1 className='display-4'>{post.frontmatter.title}</h1>
      </Container>

      <Container dangerouslySetInnerHTML={{ __html: post.html }} />

      {post.frontmatter.attachments && (<Container><h4>Attachments</h4><CardGroup>
        {post.frontmatter.attachments.map((attachment, i) => (
          <Card key={i}>
            <CardBody>
              <CardTitle><a href={attachment.filename}>{basename(attachment.filename)}</a></CardTitle>
            </CardBody>
          </Card>
        ))}
      </CardGroup></Container>)}

      {post.frontmatter.related && (<Container><h4>Related</h4><CardGroup>
        {related.map((r, i) => (
          <Card key={i}>
            <CardBody>
              <CardTitle>
                <Link to={r.path}>{r.title}</Link>
              </CardTitle>
            </CardBody>
          </Card>
        ))}
      </CardGroup></Container>)}
    </div>
  )
}

export const pageQuery = graphql`
  query PostPostByPath($path: String!) {
    site {
      siteMetadata {
        disqus
      }
    }

    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        date(formatString: "MMMM DD, YYYY")
        title
        attachments {
          filename
        }
        related {
          post
        }
      }
    }

    allMarkdownRemark{
      edges{
        node{
          frontmatter{
            title
            path
          }
        }
      }
    }
  }
`
