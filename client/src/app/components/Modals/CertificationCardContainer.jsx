import CertificationCard from "./CertificationCard";

function CertificationCardContainer({certification,openModal} ) {

return (
    <div>
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 justify-between">
          {certification.length > 0 ? (
            certification.map((file) => (   
              <CertificationCard
                key={file.id}
                filesUrl={file.filesUrl}
                description={file.description}
                openModal={openModal}
              />
            )
        )
          ) : (
            <h1>La compañia no tiene Certificaciones/Homologaciones cargadas.</h1>
          )}
        </div>    
    </div>

)

}

export default CertificationCardContainer