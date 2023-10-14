import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CountryService } from '../../service/country.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/internal/Subscription';
import { MenuItem } from 'primeng/api/menuitem';
import { Product } from '../../api/product';


interface userBalancerModel {
    quantity_animal: number;
    energy_per_month: number;
    car_distance_in_km: number;
    composted_material_quantity: number;
    fetilizante_kg: number;
    month: string;
    year: number;
}

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    selectedCountryAdvanced: any[] = [];
    filteredCountries: any[] = [];
    countries: any[] = [];
    apiUrlPost: string = 'http://127.0.0.1:8000/api/core/user_balance/';

    items!: MenuItem[];

    products!: Product[];
    carbon!: any[];

    chartData: any;

    chartOptions: any;
    listaConcatenada: string[] = [];
    listaPegada: any[] = [];


    subscription!: Subscription;
    private apiUrlGet = 'http://127.0.0.1:8000/api/core/user_balance/pegada_carbono/';

    calulaterForm: FormGroup = new FormGroup({
        quantity_animal: new FormControl(''),
        energy_per_month: new FormControl(''),
        car_distance_in_km: new FormControl(''),
        composted_material_quantity: new FormControl(''),
        fetilizante_kg: new FormControl(''),
        month: new FormControl(''),
        year: new FormControl(''),
    });

    constructor(private countryService: CountryService,
        private http: HttpClient) {
    }

    ngOnInit() {
        this.http.get<any>(this.apiUrlGet).subscribe((r) => {
            this.carbon = r
            for (let item of r) {
                let mesAno = item.month + "/" + item.year;
                this.listaConcatenada.push(mesAno);
            }
            for (let item of r) {
                this.listaPegada.push(item.pegada_total);
            }
            this.initChart();

        })
    }

    public getall(): void {
        this.http.get<any>(this.apiUrlGet).subscribe((r) => {
            this.carbon = r
            for (let item of r) {
                let mesAno = item.month + "/" + item.year;
                this.listaConcatenada.push(mesAno);
            }
            for (let item of r) {
                this.listaPegada.push(item.pegada_total);
            }
            this.initChart();

        })
    }

    public onSubmit(): void {
        const data = this.calulaterForm
        if (this.calulaterForm.valid) {
            this.http.post<userBalancerModel>(this.apiUrlPost, this.calulaterForm.value)
                .pipe(
            ).subscribe(() => {
                this.listaConcatenada = [];
                this.listaPegada = [];
                this.getall();
                this.calulaterForm.reset();
            });
        }





    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: this.listaConcatenada,
            datasets: [
                {
                    label: 'First Dataset',
                    data: this.listaPegada,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

}
