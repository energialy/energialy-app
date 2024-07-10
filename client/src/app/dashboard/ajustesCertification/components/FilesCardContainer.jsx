import FilesCard from "./FilesCard";

function FilesCardContainer({certification, openModal, onDelete, onSaveDescription  } ) {

return (
    <div>
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 justify-between">
          {certification.length > 0 ? (
            certification.map((image) => (   
              <FilesCard
                key={image.id}
                imageUrl={image.filesUrl}
                id={image.id}
                description={image.description}
                openModal={openModal}
                onDelete={onDelete}
                onSaveDescription={onSaveDescription}
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

export default FilesCardContainer