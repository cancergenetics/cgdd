from django.db import models

from django.core.urlresolvers import reverse
from django.conf.urls import url


# To manually modify field to match the changed Gene gene_name increased to 20 characters.
# mysql -u sbridgett -h sbridgett.mysql.pythonanywhere-services.com
# use sbridgett$gendep
# describe gendep_dependency;
# ALTER TABLE gendep_dependency MODIFY driver varchar(20) NOT NULL;


# Information about each gene:
class Gene(models.Model):
    gene_name   = models.CharField('Gene name', max_length=20, primary_key=True, db_index=True)  # This is a ForeignKey for Target driver AND target
    original_name = models.CharField('Original name', max_length=30) # As some names are changed, especially needed for the other studies.
    is_driver   = models.BooleanField('Is driver', db_index=True) # So will know for driver search menu/webpage which to list in the dropdown menu
    is_target   = models.BooleanField('Is target', db_index=True) # So will know for target search menu/webpage which to list in the dropdown menu
    full_name   = models.CharField('Full name', max_length=200)
    ensembl_id  = models.CharField('Ensembl Gene Id', max_length=20, blank=True) # Ensembl gene
    ensembl_protein_id  = models.CharField('Ensembl Protein Id', max_length=20, blank=True) # Ensembl protein
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
    prevname_synonyms = models.CharField('Synonyms and previous names for gene name', max_length=250, blank=True) # alias_name    ### In future change this to just synonyms and remove the prev_names and old synonyms column.
    
    num_studies = models.PositiveSmallIntegerField('Number of studies', default=0, blank=True) # smallinteger is 0 to 32767; cached number of studies that have this as a driver, generated by SQL query after loading data.
    num_histotypes = models.PositiveSmallIntegerField('Number of histotypes', default=0, blank=True)
    num_targets = models.PositiveIntegerField('Number of targetted genes', default=0, blank=True) # positiveinteger 0 to 2147483647; cached number of targets, generated by SQL query after loading data.
    num_drivers = models.PositiveIntegerField('Number of driver genes', default=0, blank=True) # positiveinteger 0 to 2147483647; cached number of targets, generated by SQL query after loading data.    
    # links       = models.CharField('External site links', max_length=250, blank=True) # Links to external gene information webpages, perhaps a comma separated list.
    # Or could use an array field, by using the Django Postgres 'django-pgfields' extension: https://www.djangopackages.com/packages/p/django-pgfields/
    # links could be a models.SlugField('...', max_length=250) # SlugField is a short label for something, containing only letters, numbers, underscores or hyphens. Theyre generally used in URLs.

    def __str__(self):
        # return self.gene_name+' '+self.entrez_id+' '+self.ensembl_id
        return self.gene_name
    def prev_names_and_synonyms_spaced(self):
        # To dispay in the template for the driver search box, as cant use functions that have arguments in the template (unless use extra custom template tgs)
        prev_names_and_synonyms = self.prev_names + ('' if self.prev_names == '' or self.synonyms == '' else '|') + self.synonyms
        return prev_names_and_synonyms.replace('|',' | ')
        
    # The "external_links" functions taht were in the Gene class, as now moved to the javascript "cgdd_functions.js" 
    

    
# Links to the research study papers:
class Study(models.Model):
    EXPERIMENTTYPE_CHOICES = (
    ('kinome siRNA', 'kinome siRNA'),
    ('genome-wide shRNA', 'genome-wide shRNA'),
    )
    class Meta:
        verbose_name_plural = "Studies" # Otherwise the Admin page just adds a 's', ie. 'Studies'
    pmid        = models.CharField('PubMed ID', max_length=30, primary_key=True, db_index=True)   # help_text="Please use the following format: <em>YYYY-MM-DD</em>."
    code        = models.CharField('Code', max_length=1) # eg. 'A' for Achilles, for faster transfer to webbrowser.
    short_name  = models.CharField('Short Name', max_length=50) # eg. 'Campbell, J. 2014'
    title       = models.CharField('Title', max_length=250)
    authors     = models.TextField('Authors')
    experiment_type = models.CharField('Experiment type', max_length=20, choices=EXPERIMENTTYPE_CHOICES, db_index=True)
    abstract    = models.TextField('Abstract')
    summary     = models.TextField('Summary') # Short summary line to use on the results table
    journal     = models.CharField('Journal', max_length=100)
    pub_date    = models.CharField('Date published', max_length=30)  # OR: models.DateTimeField('Date published')
    num_drivers = models.PositiveIntegerField('Number of driver genes', default=0, blank=True) # positiveinteger 0 to 2147483647; cached number of targets, generated by SQL query after loading data.
    num_histotypes = models.PositiveSmallIntegerField('Number of histotypes', default=0, blank=True) # smallinteger is 0 to 32767; cached number of studies that have this as a driver, generated by SQL query after loading data.
    num_targets = models.PositiveIntegerField('Number of targetted genes', default=0, blank=True)

        
    def __str__(self):
        # return self.pmid+' '+self.authors+' '+self.title+' '+self.abstract+' '+self.journal+' '+self.pub_date
        return self.pmid
        
    # The url() and weblink() functions that were part of Study class, are now in the "cgdd_functions.js" javascript.
    # But this function is still used in the studies.html template    
    def url(self):
        #        if self.pmid[0:7] == 'Pending': href = reverse('gendep:study', kwargs={'pmid': self.pmid})
        #if self.pmid[0:7] == 'Pending': href = reverse('gendep:study')
        # Fix the problem with reverse() later.
        if self.pmid[0:7] == 'Pending': href = '/gendep/study/%s/' %(self.pmid)
        else: href = 'http://www.ncbi.nlm.nih.gov/pubmed/%s' %(self.pmid)
        return href
        
    def weblink(self):
        return '<a class="tipright" href="%s" target="_blank">%s<span>%s, %s et al, %s, %s</span></a>' %(self.url(), self.short_name, self.title, self.authors[0:30], self.journal, self.pub_date)
        # <a href="http://www.ncbi.nlm.nih.gov/pubmed/{{ dependency.study.pmid }}" title="{{ dependency.study.title }}, {{ dependency.study.authors|slice:":30" }} et al, {{ dependency.study.journal }}, {{ dependency.study.pub_date }}" target="_blank">{{ dependency.study.short_name }} {{ dependency.study.pmid }}</a>



class Drug(models.Model):
    drug        = models.CharField('Drug', max_length=50, primary_key=True, db_index=True)

# class Histotype(models.Model):
#    histotype   = models.CharField('Histotype', max_length=10, primary_key=True, db_index=True)
#    full_name   = models.CharField('Histotype', max_length=30)


# Dependency = Driver-Target interactions:
class Dependency(models.Model):
    # Values for the histotype choices CharField. The two letter codes at right are used for faster transfer to webbrowser.
    HISTOTYPE_CHOICES = (
      ("BREAST",                             "Breast"),#        "Br"),
      ("LUNG",                               "Lung"),#          "Lu"),
      ("OESOPHAGUS",                         "Esophagus"),#     "Es"),  # or "Oesophagus"
      ("OSTEOSARCOMA",                       "Osteosarcoma"),#  "Os"),
      ("OVARY",                              "Ovary"),#         "Ov"),
      # More added below for Achilles data - may need to add these to the index template
	  # ("ENDOMETRIUM",                      "Endometrium"),#   "En"),  only 2 cell lines so not analysed by R
	  ("PANCREAS", 	                         "Pancreas"),#      "Pa"),
      ("CENTRAL_NERVOUS_SYSTEM",             "CNS"),#           "CN"),
	  ("HAEMATOPOIETIC_AND_LYMPHOID_TISSUE", "Blood & Lymph"),# "HL"),
	  ("INTESTINE",                          "Intestine"),#     "In"),
	  ("KIDNEY",                             "Kidney"),#        "Ki"), # kidney not in results even though 10 cell lines
      # ("LIVER",                            "Liver"),#         "Li"), only 1 cell line so not analysed by R
	  ("PROSTATE",                           "Prostate"),#      "Pr"),
	  ("SKIN",                               "Skin"),#          "Sk"),
	  # ("SOFT_TISSUE",                      "Soft tissue"),#    "So"), only 2 celllines so not analysed by R
	  ("STOMACH",                            "Stomach"),#       "St"),
	  ("URINARY_TRACT",                      "Urinary tract"),# "Ur"),
      ("PANCAN",                             "Pan cancer"),#    "PC"),
    )

    class Meta:
        
        unique_together = (('driver', 'target', 'histotype', 'study'),) # This should be unique  (previously also incuded 'study_table')
        # This 'histotype' needed added to this unique_together otherwise when the S1K table is added to the S1I table there is a conflict.
        # The 'target_variant' is no longer part of unique key, as only keeping the variant with the lowest wilcox_p value
        verbose_name_plural = "Dependencies" # Otherwise the Admin page just adds a 's', ie. 'Dependencys'

    driver      = models.ForeignKey(Gene, verbose_name='Driver gene', db_column='driver', to_field='gene_name', related_name='+', db_index=True, on_delete=models.PROTECT)
    target      = models.ForeignKey(Gene, verbose_name='Target gene', db_column='target', to_field='gene_name', related_name='+', db_index=True, on_delete=models.PROTECT)
    target_variant = models.CharField('Achilles gene variant_number', max_length=2, blank=True) # As Achilles has some genes entered with 2 or 3 variants.
    mutation_type = models.CharField('Mutation type', max_length=10)  # Set this to 'Both' for now.
    wilcox_p    = models.FloatField('Wilcox P-value', db_index=True)     # WAS: DecimalField('Wilcox P-value', max_digits=12, decimal_places=9). Index on wilcox_p because this is the order_by clause for the dependency result query.
    effect_size = models.FloatField('Effect size', db_index=True) # or should this be an integer or float? If use float and is part of query then could index this field.
    
    
    # Change this later to a Character when next rebuild table, as can't alter table columns in SQLite
    interaction = models.NullBooleanField('Functional interaction', db_index=True, ) # True if there is a known functional interaction between driver and target (from string-db.org interaction database). Allows null (ie. for unknown) values
    # Need to update the "add_ensembl_proteinids_and_stringdb.py" and "views.py" script field name too (as can't change field type in sqlite):
    interaction_hhm = models.CharField('String interaction', max_length=10, blank=True)  # Medium, High, Highest (or 4,7,9) for 400,700,900
    
    # interaction = models.CharField('Functional interaction', max_length=10, db_index=True, ) # For (Medium, High, Higher) if there is a known functional interaction between driver and target (from string-db.org interaction database). Allows null (ie. for unknown) values
    study       = models.ForeignKey(Study, verbose_name='PubMed ID', db_column='pmid', to_field='pmid', on_delete=models.PROTECT, db_index=True)
    study_table = models.CharField('Study Table', max_length=10) # The table the data is from.
    inhibitors  = models.ManyToManyField(Drug, related_name='+', blank=True) # , null=True has no effect on ManyToMany fields

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
        
    def wilcox_p_power10_format(self):
        # Displays 5E-4 as 5 x 10<sup>-4</sup>
        return ("%.0E"%(self.wilcox_p)).replace("E", " x 10<sup>")+"</sup>"
    
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
        
    def boxplot_filename(self):
       return self.driver.gene_name + "_" + self.target.gene_name+self.target_variant + "_" + self.histotype + "__PMID" + self.study.pmid + ".png"

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
