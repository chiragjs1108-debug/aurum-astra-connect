import { useState } from 'react'
import { ChevronIcon } from '../../../components/icons.jsx'

function Faq({ heading, items = [] }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="block-faq">
      {heading && <h3>{heading}</h3>}
      <div className="faq-list">
        {items.map((item, index) => {
          const isOpen = index === openIndex
          return (
            <div key={item.question} className={`faq-item${isOpen ? ' open' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <ChevronIcon className="faq-chevron" />
              </button>
              {isOpen && <p className="faq-answer">{item.answer}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Faq
