# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-30 13:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Name')),
                ('email', models.CharField(max_length=50, verbose_name='Email')),
                ('comment', models.TextField(verbose_name='Comment')),
                ('ip', models.CharField(max_length=30, verbose_name='IP address')),
                ('date', models.DateTimeField(default=django.utils.timezone.now, editable=False, verbose_name='Date')),
            ],
        ),
        migrations.CreateModel(
            name='Dependency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('target_variant', models.CharField(blank=True, max_length=2, verbose_name='Achilles gene variant_number')),
                ('mutation_type', models.CharField(max_length=10, verbose_name='Mutation type')),
                ('wilcox_p', models.FloatField(db_index=True, verbose_name='Wilcox P-value')),
                ('effect_size', models.FloatField(db_index=True, verbose_name='Effect size')),
                ('za', models.FloatField(db_index=True, default=-999.99, verbose_name='zA')),
                ('zb', models.FloatField(db_index=True, default=-999.99, verbose_name='zB')),
                ('zdiff', models.FloatField(db_index=True, default=-999.99, verbose_name='zDelta Score')),
                ('interaction', models.CharField(blank=True, max_length=10, verbose_name='String interaction')),
                ('histotype', models.CharField(choices=[('BONE', 'Bone'), ('BREAST', 'Breast'), ('CENTRAL_NERVOUS_SYSTEM', 'CNS'), ('CERVICAL', 'Cervical'), ('ENDOMETRIUM', 'Endometrium'), ('HAEMATOPOIETIC_AND_LYMPHOID_TISSUE', 'Blood & Lymph'), ('HEADNECK', 'Head & Neck'), ('INTESTINE', 'Intestine'), ('KIDNEY', 'Kidney'), ('LARGE_INTESTINE', 'Large Intestine'), ('LUNG', 'Lung'), ('OESOPHAGUS', 'Esophagus'), ('OVARY', 'Ovary'), ('PANCREAS', 'Pancreas'), ('PROSTATE', 'Prostate'), ('SKIN', 'Skin'), ('SOFT_TISSUE', 'Soft tissue'), ('STOMACH', 'Stomach'), ('URINARY_TRACT', 'Urinary tract'), ('PANCAN', 'Pan cancer')], db_index=True, max_length=35, verbose_name='Histotype')),
                ('boxplot_data', models.TextField(blank=True, default='', verbose_name='Boxplot data in CSV format')),
            ],
            options={
                'verbose_name_plural': 'Dependencies',
            },
        ),
        migrations.CreateModel(
            name='Gene',
            fields=[
                ('gene_name', models.CharField(db_index=True, max_length=25, primary_key=True, serialize=False, verbose_name='Gene name')),
                ('original_name', models.CharField(max_length=30, verbose_name='Original name')),
                ('is_driver', models.BooleanField(db_index=True, default=False, verbose_name='Is driver')),
                ('is_target', models.BooleanField(db_index=True, default=False, verbose_name='Is target')),
                ('alteration_considered', models.TextField(blank=True, verbose_name='Alteration_considered')),
                ('full_name', models.CharField(max_length=200, verbose_name='Full name')),
                ('ensembl_id', models.CharField(blank=True, max_length=20, verbose_name='Ensembl Gene Id')),
                ('ensembl_protein_id', models.CharField(blank=True, max_length=20, verbose_name='Ensembl Protein Id')),
                ('entrez_id', models.CharField(blank=True, max_length=10, verbose_name='Entrez Id')),
                ('cosmic_id', models.CharField(blank=True, max_length=25, verbose_name='COSMIC Id')),
                ('cancerrxgene_id', models.CharField(blank=True, max_length=10, verbose_name='CancerRxGene Id')),
                ('omim_id', models.CharField(blank=True, max_length=10, verbose_name='OMIM Id')),
                ('uniprot_id', models.CharField(blank=True, max_length=20, verbose_name='UniProt Ids')),
                ('vega_id', models.CharField(blank=True, max_length=25, verbose_name='Vega Id')),
                ('hgnc_id', models.CharField(blank=True, max_length=10, verbose_name='HGNC Id')),
                ('prevname_synonyms', models.CharField(blank=True, max_length=250, verbose_name='Synonyms and previous names for gene name')),
                ('inhibitors', models.TextField(blank=True, verbose_name='Inhibitors')),
                ('ncbi_summary', models.TextField(blank=True, default='', verbose_name='Entrez Gene Sumary')),
                ('driver_num_studies', models.PositiveSmallIntegerField(blank=True, default=0, verbose_name='Number of studies')),
                ('driver_study_list', models.CharField(blank=True, max_length=250, verbose_name='Tissues this driver has been tested on')),
                ('driver_num_histotypes', models.PositiveSmallIntegerField(blank=True, default=0, verbose_name='Number of histotypes for this driver')),
                ('driver_histotype_list', models.CharField(blank=True, max_length=250, verbose_name='Tissues this driver has been tested on')),
                ('driver_num_targets', models.PositiveIntegerField(blank=True, default=0, verbose_name='Number of targetted genes for this driver')),
                ('target_num_drivers', models.PositiveIntegerField(blank=True, default=0, verbose_name='Number of driver genes for this target')),
                ('target_num_histotypes', models.PositiveIntegerField(blank=True, default=0, verbose_name='Number of histotypes for this target')),
            ],
        ),
        migrations.CreateModel(
            name='Study',
            fields=[
                ('pmid', models.CharField(db_index=True, max_length=30, primary_key=True, serialize=False, verbose_name='PubMed ID')),
                ('code', models.CharField(default=' ', max_length=1, verbose_name='Code')),
                ('short_name', models.CharField(max_length=50, verbose_name='Short Name')),
                ('title', models.CharField(max_length=250, verbose_name='Title')),
                ('authors', models.TextField(verbose_name='Authors')),
                ('experiment_type', models.CharField(choices=[('kinome siRNA', 'kinome siRNA'), ('genome-wide shRNA', 'genome-wide shRNA')], db_index=True, max_length=20, verbose_name='Experiment type')),
                ('abstract', models.TextField(verbose_name='Abstract')),
                ('summary', models.TextField(verbose_name='Summary')),
                ('journal', models.CharField(max_length=100, verbose_name='Journal')),
                ('pub_date', models.CharField(max_length=30, verbose_name='Date published')),
                ('num_drivers', models.PositiveIntegerField(blank=True, default=0, verbose_name='Number of driver genes')),
                ('num_histotypes', models.PositiveSmallIntegerField(blank=True, default=0, verbose_name='Number of histotypes')),
                ('num_targets', models.PositiveIntegerField(blank=True, default=0, verbose_name='Number of targetted genes')),
            ],
            options={
                'verbose_name_plural': 'Studies',
            },
        ),
        migrations.AddField(
            model_name='dependency',
            name='driver',
            field=models.ForeignKey(db_column='driver', on_delete=django.db.models.deletion.PROTECT, related_name='+', to='gendep.Gene', verbose_name='Driver gene'),
        ),
        migrations.AddField(
            model_name='dependency',
            name='study',
            field=models.ForeignKey(db_column='pmid', on_delete=django.db.models.deletion.PROTECT, to='gendep.Study', verbose_name='PubMed ID'),
        ),
        migrations.AddField(
            model_name='dependency',
            name='target',
            field=models.ForeignKey(db_column='target', on_delete=django.db.models.deletion.PROTECT, related_name='+', to='gendep.Gene', verbose_name='Target gene'),
        ),
        migrations.AlterUniqueTogether(
            name='dependency',
            unique_together=set([('driver', 'target', 'histotype', 'study')]),
        ),
    ]
