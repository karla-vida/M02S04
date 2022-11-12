import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { NestResponse } from 'src/core/http/nest-response';
import { NestResponseBuilder } from 'src/core/http/nest-response-builder';
import { Cerveja } from './cerveja.entity';
import { CervejaService } from './cerveja.service';

@Controller('cervejas')
export class CervejaController {
  constructor(private service: CervejaService) {}

  @Get()
  public async buscarCervejas(
    @Query('page') page = 0,
    @Query('size') size = 10,
  ) {
    return await this.service.buscarCervejas(page, size);
  }

  @Post()
  public async criarCerveja(@Body() cerveja: Cerveja): Promise<NestResponse> {
    const cervejaCriada = await this.service.criarCerveja(cerveja);
    console.log('entrou no post ');
    return new NestResponseBuilder()
      .withStatus(HttpStatus.CREATED)
      .withHeaders({ Location: `/cervejas/${cervejaCriada.nome}` })
      .withBody(cervejaCriada)
      .build();
  }

  @Get(':nomeCerveja')
  public async getCerveja(@Param('nomeCerveja') nome: string) {
    const cerveja = await this.service.getCerveja(nome);

    if (!cerveja) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Cerveja não encontrada',
      });
    }

    return cerveja;
  }

  @Put()
  public async atualizarCerveja(
    @Body() cerveja: Cerveja,
  ): Promise<NestResponse> {
    console.log('entrou atualizar 11');
    const cervejaChecar = await this.service.getCerveja(cerveja.nome);
    console.log('entrou atualizar');
    if (!cervejaChecar) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Cerveja não encontrada',
      });
    }
    console.log('antes do atualizar');
    const cervejaAtualizada = await this.service.atualizarCerveja(cerveja);
    return new NestResponseBuilder()
      .withStatus(HttpStatus.CREATED)
      .withHeaders({ Location: `/cerveja/${cervejaAtualizada.nome}` })
      .withBody(cervejaAtualizada)
      .build();
  }

  @Delete(':nomeCerveja')
  @HttpCode(204)
  public async apagar(@Param('nomeCerveja') nome: string) {
    const cerveja = await this.service.getCerveja(nome);

    if (!cerveja) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Cerveja não encontrada',
      });
    }

    await this.service.apagarCerveja(nome);
  }
}
