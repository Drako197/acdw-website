import { CustomerTypeSelector } from '../components/home/CustomerTypeSelector'

export function CustomerSelectionPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="heading-1 mb-6">
            Choose Your Experience
          </h1>
          <p className="text-large max-w-3xl mx-auto">
            Get a personalized experience tailored to your specific needs. 
            Whether you're a homeowner, HVAC professional, or city official, 
            we have solutions designed for you.
          </p>
        </div>
        
        <CustomerTypeSelector />
      </div>
    </div>
  )
}
