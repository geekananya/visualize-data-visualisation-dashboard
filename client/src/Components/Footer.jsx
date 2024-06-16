import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
// import './styles.css'

export default function Footer(){
    return (
        <div className="tc pa3 pt2 bt3 shadow-5 w-100 bg-lightest-blue">
            <p className='mb1 mt0'>Designed and developed by:</p>
            <h3 className='mb2 mt0'>Ananya Verma</h3>
            <div className="social-links flex black">
                <div className='center'>
                    <a rel="noreferrer" href="mailto:mail.ananyaverma23@gmail.com" target="_blank">
                        <FontAwesomeIcon icon={faEnvelope} size="2x" color="peru" className='grow'/>
                    </a>
                    <a rel="noreferrer" href="https://www.github.com/geekananya" target="_blank">
                        <FontAwesomeIcon icon={faGithub} size="2x" color="purple" className='ml3 mr3 grow'/>
                    </a>
                    <a rel="noreferrer" href="https://www.linkedin.com/in/geekananya" target="_blank">
                        <FontAwesomeIcon icon={faLinkedin} size="2x" color="navy" className='grow'/>
                    </a>
                </div>
            </div>
        </div>
    )
}