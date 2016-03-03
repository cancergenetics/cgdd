from django.db import models

from django.core.urlresolvers import reverse
from django.conf.urls import url

# Information about each gene:
class Gene(models.Model):
    gene_name   = models.CharField('Gene name', max_length=10, primary_key=True, db_index=True)  # This is a ForeignKey for Target driver AND target
    original_name = models.CharField('Original name', max_length=30) # As some names are changed, especially needed for the other studies.
    is_driver   = models.BooleanField('Is driver', db_index=True) # So will know for search menus which to list in the dropdown menu
    full_name   = models.CharField('Full name', max_length=200)
    ensembl_id  = models.CharField('Ensembl Id', max_length=20, blank=True) # Ensembl
    entrez_id   = models.CharField('Entrez Id', max_length=10, blank=True)  # Entrez
    cosmic_id   = models.CharField('COSMIC Id', max_length=10, blank=True) # Same as gene_name, or empty if not in COSMIC
    cancerrxgene_id = models.CharField('CancerRxGene Id', max_length=10, blank=True) # Not available yet
    omim_id     = models.CharField('OMIM Id', max_length=10, blank=True) # Online Mendelian Inheritance in Man
    uniprot_id  = models.CharField('UniProt Ids', max_length=20, blank=True) # UniProt protein Ids.
    vega_id     = models.CharField('Vega Id', max_length=25, blank=True) # Vega Id.
    hgnc_id     = models.CharField('HGNC Id', max_length=10, blank=True) # HGNC Id.
    # protein_id  = models.CharField('Protein Id', max_length=10, blank=True) # Protein Id
    prev_names  = models.CharField('Previous name', max_length=50, blank=True) # Previous gene name(s)
    synonyms    = models.CharField('Synonyms for gene name', max_length=250, blank=True) # alias_name
    # links       = models.CharField('External site links', max_length=250, blank=True) # Links to external gene information webpages, perhaps a comma separated list.
    # Or could use an array field, by using the Django Postgres 'django-pgfields' extension: https://www.djangopackages.com/packages/p/django-pgfields/
    # links could be a models.SlugField('...', max_length=250) # SlugField is a short label for something, containing only letters, numbers, underscores or hyphens. Theyre generally used in URLs.

    def __str__(self):
        # return self.gene_name+' '+self.entrez_id+' '+self.ensembl_id
        return self.gene_name
    def prev_names_and_synonyms_spaced(self):
        # To dispay in the template for the driver search box, as cant use functions that have arguments in the template (unless use extra custom template tgs)
        prev_names_and_synonyms = self.prev_names + ('' if self.prev_names == '' or self.synonyms == '' else ' | ') + self.synonyms
        return prev_names_and_synonyms.replace('|',' | ')
    # Using a span with <a class="tip":
    def external_links(self, div='|'):
        # gene is a row in the Gene table
        # Building these links here, rather than in template as are used twice in the template:
        links  = '<a class="tip" href="http://www.genecards.org/cgi-bin/carddisp.pl?gene=%s" target="_blank">GeneCards<span>Genecards</span></a> ' %(self.gene_name)
        links += div+' <a class="tip" href="http://www.ncbi.nlm.nih.gov/gene/%s" target="_blank">Entrez<span>Entrez Gene at NCBI</span></a> ' %(self.entrez_id)
        links += div+' <a class="tip" href="http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=%s" target="_blank">Ensembl<span>Ensembl Gene</span></a> ' %(self.ensembl_id)
        links += div+' <a class="tip" href="http://vega.sanger.ac.uk/Homo_sapiens/Gene/Summary?g=%s" target="_blank">Vega<span>Vertebrate Genome Annotation</span></a> ' %(self.vega_id)
        links += div+' <a class="tip" href="http://www.omim.org/entry/%s" target="_blank">OMIM<span>Online Mendelian Inheritance in Man</span></a> ' %(self.omim_id)
        links += div+' <a class="tip" href="http://www.genenames.org/cgi-bin/gene_symbol_report?hgnc_id=%s" target="_blank">HGNC<span>HUGO Gene Nomenclature Committee</span></a> ' %(self.hgnc_id)
        links += div+' <a class="tip" href="http://www.cancerrxgene.org/translation/Search?query=%s" target="_blank">CancerRxGene<span>CancerRxGene search</span></a> ' %(self.gene_name)
        links += div+' <a class="tip" href="http://www.cbioportal.org/ln?q=%s" target="_blank">cBioPortal<span>cBioPortal for Cancer Genomics</span></a> ' %(self.gene_name)
        links += div+' <a class="tip" href="http://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=%s" target="_blank">COSMIC<span>Catalogue of Somatic Mutations in Cancer</span></a> ' %(self.gene_name)
        links += div+' <a class="tip" href="https://cansar.icr.ac.uk/cansar/molecular-targets/%s/" target="_blank">CanSAR<span>CanSAR</span></a>' %(self.uniprot_id)
        return links
    """
    Previously used the <a title="" attribute (but can't change style, unless two boxes will appear):
    def external_links(self, div='|'):
        # gene is a row in the Gene table
        # Building these links here, rather than in template as are used twice in the template:
        links  = '<a href="http://www.genecards.org/cgi-bin/carddisp.pl?gene=%s" title="Genecards" target="_blank">GeneCards</a> ' %(self.gene_name)
        links += div+' <a href="http://www.ncbi.nlm.nih.gov/gene/%s" title="Entrez Gene at NCBI" target="_blank">Entrez</a> ' %(self.entrez_id)
        links += div+' <a href="http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=%s" title="Ensembl Gene" target="_blank">Ensembl</a> ' %(self.ensembl_id)
        links += div+' <a href="http://vega.sanger.ac.uk/Homo_sapiens/Gene/Summary?g=%s" title="Vertebrate Genome Annotation" target="_blank">Vega</a> ' %(self.vega_id)
        links += div+' <a href="http://www.omim.org/entry/%s" title="Online Mendelian Inheritance in Man" target="_blank">OMIM</a> ' %(self.omim_id)
        links += div+' <a href="http://www.genenames.org/cgi-bin/gene_symbol_report?hgnc_id=%s" title="HUGO Gene Nomenclature Committee" target="_blank">HGNC</a> ' %(self.hgnc_id)
        links += div+' <a href="http://www.cancerrxgene.org/translation/Search?query=%s" title="CancerRxGene search" target="_blank">CancerRxGene</a> ' %(self.gene_name)
        links += div+' <a href="http://www.cbioportal.org/ln?q=%s" title="cBioPortal for Cancer Genomics" target="_blank">cBioPortal</a> ' %(self.gene_name)
        links += div+' <a href="http://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=%s" title="Catalogue of Somatic Mutations in Cancer" target="_blank">COSMIC</a> ' %(self.gene_name)
        links += div+' <a href="https://cansar.icr.ac.uk/cansar/molecular-targets/%s/" title="CanSAR" target="_blank">CanSAR</a>' %(self.uniprot_id)
        return links
    """

    

# Links to the research study papers:
class Study(models.Model):
    EXPERIMENTTYPE_CHOICES = (
    ('kinome siRNA', 'kinome siRNA'),
    ('genome-wide shRNA', 'genome-wide shRNA'),
    )
    class Meta:
        verbose_name_plural = "Studies" # Otherwise the Admin page just adds a 's', ie. 'Studies'
    pmid        = models.CharField('PubMed ID', max_length=30, primary_key=True, db_index=True)   # help_text="Please use the following format: <em>YYYY-MM-DD</em>."
    short_name  = models.CharField('Short Name', max_length=50) # eg. 'Campbell, J. 2014'
    title       = models.CharField('Title', max_length=250)
    authors     = models.TextField('Authors')
    experiment_type = models.CharField('Experiment type', max_length=20, choices=EXPERIMENTTYPE_CHOICES, db_index=True)
    description = models.TextField('Description')
    summary     = models.TextField('Summary') # Short summary line to use on the results table
    journal     = models.CharField('Journal', max_length=100)
    pub_date    = models.CharField('Date published', max_length=30)  # OR: models.DateTimeField('Date published')

    def __str__(self):
        # return self.pmid+' '+self.authors+' '+self.title+' '+self.description+' '+self.journal+' '+self.pub_date
        return self.pmid

    def weblink(self):
        #        if self.pmid[0:7] == 'Pending': href = reverse('gendep:study', kwargs={'pmid': self.pmid})
        #if self.pmid[0:7] == 'Pending': href = reverse('gendep:study')
        # Fix the problem with reverse() later.
        if self.pmid[0:7] == 'Pending': href = '/gendep/study/%s/' %(self.pmid)
        else: href = 'http://www.ncbi.nlm.nih.gov/pubmed/%s' %(self.pmid)
        return '<a class="tip" href="%s" target="_blank">%s<span>%s, %s et al, %s, %s</span></a>' %(href, self.short_name, self.title, self.authors[0:30], self.journal, self.pub_date)
        # <a href="http://www.ncbi.nlm.nih.gov/pubmed/{{ dependency.study.pmid }}" title="{{ dependency.study.title }}, {{ dependency.study.authors|slice:":30" }} et al, {{ dependency.study.journal }}, {{ dependency.study.pub_date }}" target="_blank">{{ dependency.study.short_name }} {{ dependency.study.pmid }}</a>
"""
    def weblink(self):
        return '<a href="http://www.ncbi.nlm.nih.gov/pubmed/%s" title="%s, %s et al, %s, %s" target="_blank">%s</a>' %(self.pmid, self.title, self.authors[0:30], self.journal, self.pub_date, self.short_name)
"""

class Drug(models.Model):
    drug        = models.CharField('Drug', max_length=50, primary_key=True, db_index=True)

# class Histotype(models.Model):
#    histotype   = models.CharField('Histotype', max_length=10, primary_key=True, db_index=True)
#    full_name   = models.CharField('Histotype', max_length=30)


# Dependency = Driver-Target interactions:
class Dependency(models.Model):
    # Values for the histotype choices CharField: 
    HISTOTYPE_CHOICES = (
      ("BREAST", "Breast"),
      ("LUNG", "Lung"),
      ("OESOPHAGUS", "Oesophagus"),
      ("OSTEOSARCOMA", "Osteosarcoma"),
      ("OVARY", "Ovary"),
      ("PANCAN", "Pan cancer"),      
      )

    class Meta:
        unique_together = (('driver', 'target', 'histotype', 'study'),) # This should be unique  (previously also incuded 'study_table')
        # This 'histotype' needed added to this unique_together otherwise when the S1K table is added to the S1I table there is a conflict.
        verbose_name_plural = "Dependencies" # Otherwise the Admin page just adds a 's', ie. 'Dependencys'

    driver      = models.ForeignKey(Gene, verbose_name='Driver gene', db_column='driver', to_field='gene_name', related_name='+', db_index=True, on_delete=models.PROTECT)
    target      = models.ForeignKey(Gene, verbose_name='Target gene', db_column='target', to_field='gene_name', related_name='+', db_index=True, on_delete=models.PROTECT)
    mutation_type = models.CharField('Mutation type', max_length=10)  # Set this to 'Both' for now.
    wilcox_p    = models.FloatField('Wilcox P-value')     # WAS: DecimalField('Wilcox P-value', max_digits=12, decimal_places=9)
    study       = models.ForeignKey(Study, verbose_name='PubMed ID', db_column='pmid', to_field='pmid', on_delete=models.PROTECT, db_index=True)
    study_table = models.CharField('Study Table', max_length=10) # The table the data is from.
    inhibitors  = models.ManyToManyField(Drug, related_name='+')

    # histotype   = models.ForeignKey(Histotype, verbose_name='Histotype', db_column='histotype', to_field='histotype', related_name='+', db_index=True, on_delete=models.PROTECT)
    # Now using a choices field instead of the above Foreign key to a separate table. 
    # can add a validator for the web form, eg: validators=[validate_histotype_choice],
    histotype   = models.CharField('Histotype', max_length=12, choices=HISTOTYPE_CHOICES, db_index=True )   # also optional "default" parameter
    
    def histotype_full_name(h):
       for row in Dependency.HISTOTYPE_CHOICES:
          if row[0] == h: return row[1]
       return "Unknown"
       
    def __str__(self):
        # return self.table+' '+self.driver.gene_name+' '+self.target.gene_name+' '+self.histotype+' '+str(self.wilcox_p)+' '+str(self.study.pmid)
        return self.target.gene_name

    def very_significant(self):
        return self.wilcox_p <= 0.005
        
    # Based on: https://groups.google.com/forum/#!topic/django-users/SzYgjbrYVCI
    def __setattr__(self, name, value):
        if name == 'histotype':
            found = False
            for row in Dependency.HISTOTYPE_CHOICES:
                if row[0] == value:
                    found = True
                    break
            if not found: raise ValueError('Invalid value "%s" for histotype choices: %s' %(value, Dependency.HISTOTYPE_CHOICES))
        models.Model.__setattr__(self, name, value)



# NOTES:
# =====
# For ForeignKeys:
#   if don't need the ForeignKey indexed, then add: db_index=False 
#   if use db_column='name' then won't append an '_id' to the column name
#   set related_name='+' so that Django will not to create a backwards relation
# Maybe add a 'db_constraint=False' to not enforce foreign key

# primary key could be: driver + target + 

# To use extra id field in the Gene table, use just:   
#    driver      = models.ForeignKey(Gene, verbose_name='Driver gene', related_name='driver_gene', db_index=True, on_delete=models.PROTECT)
#    target      = models.ForeignKey(Gene, verbose_name='Target gene', related_name='target_gene', db_index=True, on_delete=models.PROTECT)

#    plot        =  models.CharField or models.SlkugField or models.ImageField or just use the driver name for now.

# To ensure unique: use 'unique_together':
# class Meta:
#        unique_together = (('driver', 'target'),)
# Alternatively this CompositeField is not in Django 1.9, but should be in future versions:
#    driver_target = models.CompositeField(('driver', 'target'), primary_key = True)

# Alternative actions to take when foreign key is deleted:
# on_delete=models.CASCADE
# on_delete=models.PROTECT      Prevent deletion of the referenced object by raising ProtectedError, a subclass of django.db.IntegrityError.
# on_delete=models.DO_NOTHING   Take no action. If your database backend enforces referential integrity, this will cause an IntegrityError unless you manually add an SQL ON DELETE constraint to the database field.
